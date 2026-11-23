import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import { notFound } from "next/navigation"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getTranslations } from "next-intl/server"
import { Noto_Sans_Mono, Red_Hat_Mono } from "next/font/google"

import "./globals.css"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { routing } from "@/i18n/routing"
import { globalStructuredData } from "@/data/structured-data"
import { absoluteUrl, openGraphImagePath, websiteURL } from "@/data/search-engine-optimization"

/* ——— Fonts —————————————————————————————————————————————————————————— */

// Amstelvar is a variable serif with weight/width axes; self-hosted because it
// is not distributed through next/font/google. It carries display headings and
// body copy.
const amstelvar = localFont({
	src: "../../../public/amstelvar.woff2",
	variable: "--font-amstelvar",
	display: "swap",
	fallback: ["Georgia", "serif"],
})

// Red Hat Mono: Latin UI/metadata text.
const redHatMono = Red_Hat_Mono({
	subsets: ["latin", "latin-ext"],
	weight: ["400", "500"],
	variable: "--font-red-hat-mono",
	display: "swap",
})

// Noto Sans Mono: Cyrillic monospace for Russian and Belarusian.
const notoSansMono = Noto_Sans_Mono({
	subsets: ["cyrillic", "latin", "latin-ext"],
	weight: ["400", "500"],
	variable: "--font-noto-sans-mono",
	display: "swap",
})

/* ——— Metadata ——————————————————————————————————————————————————————— */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale: rawLocale } = await params
	const locale = hasLocale(routing.locales, rawLocale) ? rawLocale : routing.defaultLocale
	const translations = await getTranslations({ locale, namespace: "metadata" })

	return {
		// A metadataBase makes every relative URL (canonical, OG images) absolute
		// in the emitted HTML. Telegram is strict about this.
		metadataBase: new URL(websiteURL),
		title: {
			default: "kuzminklk",
			template: "%s | kuzminklk",
		},
		description: translations("description"),
		applicationName: "kuzminklk",
		authors: [{ name: translations("authors.daniel-cosmo"), url: websiteURL }],
		creator: translations("authors.daniel-cosmo"),
		publisher: translations("authors.daniel-cosmo"),
		category: "technology",
		keywords: [
			"Daniel Cosmo",
			"kuzminklk",
			"Даниил Кузьмин",
			"developer",
			"web development",
			"Web3",
			"photography",
			"sport",
			"books",
		],
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-image-preview": "large",
				"max-snippet": -1,
				"max-video-preview": -1,
			},
		},
		openGraph: {
			type: "website",
			siteName: "kuzminklk",
			title: translations("title"),
			description: translations("description"),
			url: websiteURL,
			images: [
				{
					url: absoluteUrl(openGraphImagePath(locale)),
					width: 1200,
					height: 630,
					alt: translations("images.open-graph.alternative"),
					type: "image/png",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: translations("title"),
			description: translations("description"),
			images: [
				{
					url: absoluteUrl(openGraphImagePath(locale)),
					alt: translations("images.open-graph.alternative"),
				},
			],
		},
		verification: {
			google: "Lhm9hi-5ff4o9Inx9OTOaQzlnoxhvPpdFW6HJcwk__c",
		},
	}
}

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	colorScheme: "light dark",
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#f2ecdb" },
		{ media: "(prefers-color-scheme: dark)", color: "#050310" },
	],
}

/* ——— Layout ————————————————————————————————————————————————————————— */

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }))
}

/**
 * Applies the saved theme before first paint. Inlined (rather than loaded as a
 * file) so there is no flash of the wrong theme and no extra request.
 */
const themeInitialisationScript = `
(function () {
	try {
		var theme = localStorage.getItem("theme");
		if (theme === "light" || theme === "dark") {
			document.documentElement.dataset.theme = theme;
			document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
				meta.setAttribute("content", theme === "dark" ? "#050310" : "#f2ecdb");
			});
		}
	} catch (error) {}
})();
`

export default async function LocaleLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode
	params: Promise<{ locale: string }>
}>) {
	const { locale } = await params

	if (!hasLocale(routing.locales, locale)) {
		notFound()
	}

	const translations = await getTranslations({ locale, namespace: "common" })
	const structuredData = globalStructuredData(websiteURL)
	const fontClassName = `${amstelvar.variable} ${redHatMono.variable} ${notoSansMono.variable}`

	return (
		<html
			lang={locale}
			dir="ltr"
			className={fontClassName}
			// The theme is written to data-theme before hydration, so the server
			// and client trees intentionally differ on that attribute.
			suppressHydrationWarning
			data-scroll-behavior="smooth"
		>
			<body id="top">
				<script dangerouslySetInnerHTML={{ __html: themeInitialisationScript }} />

				<a className="skip-link" href="#main">
					{translations("skip-to-content")}
				</a>

				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(structuredData),
					}}
				/>

				<NextIntlClientProvider>
					<Header />
					{children}
					<Footer />
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
