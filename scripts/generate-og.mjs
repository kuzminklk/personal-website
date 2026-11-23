#!/usr/bin/env node
/**
 * Generate localized Open Graph images (1200 × 630) for the personal website.
 *
 *   node scripts/generate-og.mjs                 # every known locale → public/open-graph/{locale}.png
 *   node scripts/generate-og.mjs --only=ru       # one (or several: --only=en,ru) locale(s)
 *   node scripts/generate-og.mjs --audit         # also dump element boxes (layout debugging)
 *
 * How it works
 * ------------
 * 1. Reads the active locales from src/i18n/routing.ts (so new locales are picked
 *    up automatically) and additionally probes src/messages/{be,by,pl}.json for
 *    locales whose translations already exist but are not routed yet. The
 *    legacy "by" file is probed too for safety; locales without any translated
 *    description are skipped unless they are already routed.
 * 2. For each locale it reads src/messages/{locale}.json → metadata.description
 *    (falling back to English when the file is missing, empty or has no
 *    description — translations may still be in progress).
 * 3. Renders scripts/og-template.html into a temp file, substituting
 *    {{PLACEHOLDERS}} and absolute file:// URLs for the self-hosted fonts.
 * 4. Two passes through headless Google Chrome:
 *      a. `--dump-dom` with #audit → the page auto-fits the localized tagline
 *         to at most two lines and reports the chosen font size;
 *      b. `--screenshot` with that size baked into the CSS → exactly
 *         1200 × 630 at device scale factor 1 (deterministic output).
 * 5. Validates that every output is a PNG with the expected dimensions, that
 *    the tagline stayed within two lines, and warns above the 400 KB target.
 *
 * No extra dependencies: Node >= 20 + Google Chrome/Chromium on PATH
 * (override with CHROME_BIN=/path/to/chrome).
 */

import { execFileSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const WIDTH = 1200
const HEIGHT = 630
const MAX_BYTES = 400 * 1024 // soft target for Telegram-friendly asset size

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(SCRIPT_DIR, "..")
const TEMPLATE_PATH = path.join(SCRIPT_DIR, "og-template.html")
const MESSAGES_DIR = path.join(ROOT, "src", "messages")
const ROUTING_PATH = path.join(ROOT, "src", "i18n", "routing.ts")
const OUTPUT_DIR = path.join(ROOT, "public", "open-graph")

/* ——— Locale discovery ——— */

/** Locales actually wired into next-intl routing. */
function readRoutedLocales() {
	try {
		const source = fs.readFileSync(ROUTING_PATH, "utf8")
		const match = source.match(/locales\s*=\s*\[([^\]]*)\]\s*as\s+const/)
		if (!match) throw new Error("could not locate `locales = [...] as const`")
		const locales = [...match[1].matchAll(/["']([a-zA-Z-]+)["']/g)].map((m) => m[1])
		if (locales.length === 0) throw new Error("empty locale list")
		return locales
	} catch (error) {
		console.warn(`⚠  Falling back to en,ru — ${error.message}`)
		return ["en", "ru"]
	}
}

/** Reads metadata description/title for a locale; null when unavailable. */
function readMetadata(locale) {
	const file = path.join(MESSAGES_DIR, `${locale}.json`)
	if (!fs.existsSync(file)) return null
	try {
		const json = JSON.parse(fs.readFileSync(file, "utf8"))
		const metadata = json?.metadata
		if (!metadata || typeof metadata !== "object") return null
		return {
			description: typeof metadata.description === "string" ? metadata.description : "",
			title: typeof metadata.title === "string" ? metadata.title : "",
		}
	} catch (error) {
		console.warn(`⚠  Could not parse src/messages/${locale}.json (${error.message})`)
		return null
	}
}

function describeLocale(locale) {
	const metadata = readMetadata(locale)
	return {
		locale,
		description: metadata?.description?.trim() ?? "",
		hasOwnText: Boolean(metadata?.description?.trim()),
	}
}

/** Locales to render: routed ones, plus probe candidates with real translations. */
function resolveLocales() {
	const routed = readRoutedLocales()
	const extraCandidates = ["be", "by", "pl"].filter((locale) => !routed.includes(locale))

	const queue = [...routed]
	for (const candidate of extraCandidates) {
		const info = describeLocale(candidate)
		if (info.hasOwnText) queue.push(candidate)
	}

	return [...new Set(queue)]
}

/* ——— Text preparation ——— */

const HTML_ENTITIES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }

function escapeHTML(value) {
	return value.replace(/[&<>"']/g, (character) => HTML_ENTITIES[character])
}

/** Collapse whitespace, strip simple markup and trailing punctuation noise. */
function normalizeText(value) {
	return String(value)
		.replace(/<[^>]+>/g, "")
		.replace(/\s+/g, " ")
		.trim()
		.replace(/\s+([,.;:!?…])/g, "$1")
		.replace(/(\p{L})'(?=\p{L})/gu, "$1\u2019") // typographic apostrophe: Cosmo's → Cosmo’s
}

/**
 * Truncate on a word boundary without cutting a word in half.
 * Keeps the original ellipsis when present, adds one only when needed.
 */
function truncate(value, maxLength) {
	if (value.length <= maxLength) return value
	const sliced = value.slice(0, maxLength - 1)
	const cut = Math.max(sliced.lastIndexOf(" "), sliced.lastIndexOf(","), sliced.lastIndexOf(";"))
	const base = (cut > maxLength * 0.5 ? sliced.slice(0, cut) : sliced).replace(/[\s,;:.–—-]+$/, "")
	return `${base}…`
}

/**
 * First-guess tagline size before measurement. The browser auto-fits the
 * final size (≤ 2 lines); this value only matters if measurement fails.
 */
function initialTaglineSize() {
	return 46
}

/* ——— Rendering ——— */

function chromeBinary() {
	const candidates = [
		process.env.CHROME_BIN,
		"google-chrome",
		"google-chrome-stable",
		"chromium",
		"chromium-browser",
	].filter(Boolean)
	for (const candidate of candidates) {
		try {
			execFileSync(candidate, ["--version"], { stdio: "pipe" })
			return candidate
		} catch {
			// try the next candidate
		}
	}
	throw new Error("No Chrome/Chromium found. Set CHROME_BIN=/path/to/chrome.")
}

function buildHTML({ template, locale, tagline, wordmark, localeCode, fonts, taglineSizePx }) {
	const tokens = {
		LANG: locale,
		FONT_SERIF: fonts.serif,
		FONT_PIXEL_LATIN: fonts.pixelLatin,
		FONT_PIXEL_LATIN_EXT: fonts.pixelLatinExt,
		FONT_PIXEL_CYRILLIC: fonts.pixelCyrillic,
		WORDMARK: escapeHTML(wordmark),
		TAGLINE: escapeHTML(tagline),
		TAGLINE_SIZE_PX: String(Number(taglineSizePx.toFixed(1))),
		LOCALE_CODE: escapeHTML(localeCode),
	}

	// Single-pass replacement so injected text can never be re-expanded.
	return template.replace(/\{\{([A-Z_]+)\}\}/g, (whole, key) => (key in tokens ? tokens[key] : whole))
}

function fontURLs() {
	const toURL = (file) => pathToFileURL(path.join(ROOT, file)).href
	return {
		serif: toURL("public/amstelvar.woff2"),
		pixelLatin: toURL("public/fonts/pixelify-sans-latin.woff2"),
		pixelLatinExt: toURL("public/fonts/pixelify-sans-latin-ext.woff2"),
		pixelCyrillic: toURL("public/fonts/pixelify-sans-cyrillic.woff2"),
	}
}

const CHROME_ARGS = [
	"--headless=new",
	"--no-sandbox",
	"--disable-gpu",
	"--disable-dev-shm-usage",
	"--hide-scrollbars",
	"--force-device-scale-factor=1",
	`--window-size=${WIDTH},${HEIGHT}`,
	"--run-all-compositor-stages-before-draw",
	"--virtual-time-budget=4000",
]

/** Rasterizes the page. When `audit` is set returns the layout report instead. */
function render({ chrome, htmlPath, outputPath, audit = false }) {
	const url = pathToFileURL(htmlPath).href
	if (audit) {
		// #audit makes the template expose measurements through document.title.
		const args = [...CHROME_ARGS, "--dump-dom", `${url}#audit`]
		const dom = execFileSync(chrome, args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024, timeout: 120_000 })
		const title = dom.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ""
		const json = title.trim().startsWith("{") ? JSON.parse(title.replace(/&quot;/g, '"').replace(/&amp;/g, "&")) : null
		return json
	}

	const args = [...CHROME_ARGS, `--screenshot=${outputPath}`, url]
	execFileSync(chrome, args, { stdio: ["ignore", "pipe", "pipe"], timeout: 120_000 })
	return null
}

/** Minimal PNG header check — type, dimensions, bit depth/colour type. */
function inspectPNG(file) {
	const buffer = fs.readFileSync(file)
	const signature = buffer.subarray(0, 8).toString("hex")
	if (signature !== "89504e470d0a1a0a") throw new Error("not a PNG (bad signature)")
	const width = buffer.readUInt32BE(16)
	const height = buffer.readUInt32BE(20)
	const bitDepth = buffer[24]
	const colorType = buffer[25]
	return { width, height, bitDepth, colorType, bytes: buffer.length }
}

/* ——— Main ——— */

function main() {
	const flags = process.argv.slice(2)
	const onlyArg = flags.find((flag) => flag.startsWith("--only="))
	const only = onlyArg
		? onlyArg
				.slice("--only=".length)
				.split(",")
				.map((value) => value.trim())
		: null
	const audit = flags.includes("--audit")

	if (!fs.existsSync(TEMPLATE_PATH)) throw new Error(`Missing template: ${TEMPLATE_PATH}`)
	const template = fs.readFileSync(TEMPLATE_PATH, "utf8")
	const fonts = fontURLs()
	for (const [name, url] of Object.entries(fonts)) {
		const file = fileURLToPath(url)
		if (!fs.existsSync(file)) throw new Error(`Missing font for ${name}: ${file}`)
	}

	const chrome = chromeBinary()
	const locales = resolveLocales()
	const selected = only ? locales.filter((locale) => only.includes(locale)) : locales

	if (selected.length === 0) {
		throw new Error(`No locales selected. Known: ${locales.join(", ")}`)
	}

	const english = describeLocale("en")
	if (!english.hasOwnText) console.warn("⚠  src/messages/en.json has no metadata.description — taglines may be blank.")

	fs.mkdirSync(OUTPUT_DIR, { recursive: true })
	const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "og-render-"))
	const results = []

	try {
		for (const locale of selected) {
			const own = describeLocale(locale)
			const source = own.hasOwnText ? own : english
			const fallback = !own.hasOwnText && locale !== "en"
			const description = normalizeText(source.description)
			const tagline = truncate(description, 132)
			if (!tagline) throw new Error(`No tagline available for locale "${locale}" (and no English fallback)`)

			const base = {
				template,
				locale,
				tagline,
				wordmark: "kuzminklk",
				localeCode: locale.toUpperCase(),
				fonts,
			}
			const htmlPath = path.join(tempDir, `${locale}.html`)
			const outputPath = path.join(OUTPUT_DIR, `${locale}.png`)

			// Pass 1 — let the browser auto-fit the tagline (≤ 2 lines) and report its size.
			fs.writeFileSync(htmlPath, buildHTML({ ...base, taglineSizePx: initialTaglineSize() }))
			let measurement = null
			try {
				measurement = render({ chrome, htmlPath, audit: true })
			} catch (error) {
				console.warn(`⚠  Layout measurement failed for ${locale} (${error.message}); using fallback size.`)
			}

			const taglineSizePx =
				measurement && Number.isFinite(measurement.fittedTaglinePx) ? measurement.fittedTaglinePx : initialTaglineSize()

			if (audit) {
				console.log(`\n${locale}.png layout:`, JSON.stringify(measurement, null, 2))
				continue
			}

			// Pass 2 — bake the fitted size in and rasterize deterministically.
			fs.writeFileSync(htmlPath, buildHTML({ ...base, taglineSizePx }))
			render({ chrome, htmlPath, outputPath })

			const stats = inspectPNG(outputPath)
			if (stats.width !== WIDTH || stats.height !== HEIGHT) {
				throw new Error(
					`${locale}.png is ${stats.width}×${stats.height}, expected ${WIDTH}×${HEIGHT}. ` +
						"Check --force-device-scale-factor=1 and --window-size.",
				)
			}
			const lines = measurement?.taglineLines ?? null
			if (lines !== null && lines > 2) {
				throw new Error(`${locale}.png tagline still wraps to ${lines} lines — refusing to ship a clipped layout.`)
			}
			results.push({ locale, fallback, tagline, ...stats, taglineSizePx, lines })
		}
	} finally {
		fs.rmSync(tempDir, { recursive: true, force: true })
	}

	if (audit) return

	const kilobyte = (bytes) => `${(bytes / 1024).toFixed(1)} KB`
	console.log("\nOpen Graph assets →", path.relative(ROOT, OUTPUT_DIR))
	for (const result of results) {
		const size = kilobyte(result.bytes)
		const warning = result.bytes > MAX_BYTES ? `  ⚠ over ${MAX_BYTES / 1024} KB target` : ""
		const fallback = result.fallback ? "  (English fallback)" : ""
		const fitted = `${result.taglineSizePx}px${result.lines ? ` / ${result.lines} lines` : ""}`
		console.log(
			`  ${result.locale}.png  ${result.width}×${result.height}  ${size}  ` +
				`[tagline ${fitted}]${fallback}${warning}\n    “${result.tagline}”`,
		)
	}
	console.log("\nDone. Regenerate any time with: node scripts/generate-og.mjs\n")
}

try {
	main()
} catch (error) {
	console.error(`\n✖ ${error.message}\n`)
	process.exitCode = 1
}
