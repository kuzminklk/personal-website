import type { Metadata } from "next"
import localFont from "next/font/local"
import { notFound } from "next/navigation"
import { Red_Hat_Mono, Noto_Sans_Mono } from "next/font/google"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getTranslations } from "next-intl/server"

import "./globals.css"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { routing } from "@/i18n/routing"

const redHatMono = Red_Hat_Mono({ subsets: ["latin"], weight: "400" })
const notoSansMono = Noto_Sans_Mono({ weight: "400" })

const amstelvar = localFont({
	src: "../../../public/amstelvar.woff2",
	display: "swap",
})

export async function generateMetadata(): Promise<Metadata> {
	const translations = await getTranslations("metadata")

	return {
		title: {
			default: "kuzminklk",
			template: "%s | kuzminklk",
		},
		description: translations("description"),
		authors: [
			{
				name: translations("authors.daniel-cosmo"),
			},
		],
		creator: translations("authors.daniel-cosmo"),
		robots: {
			index: true,
			follow: true,
		},
		icons: {
			icon: [
				{
					url: "/scroll.svg",
				},
			],
		},
		openGraph: {
			type: "website",
			siteName: "kuzminklk",
			title: "Daniel Cosmo's personal website",
			description:
				"Daniel Cosmo's (kuzminklk) personal website about development, photography, sport…",
			url: "https://kuzminklk.vercel.app/",
			images: [
				{
					url: "/open-graph.png",
					width: 1200,
					height: 640,
					alt: "Man are running in mountains",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: "Daniel Cosmo's personal website",
			description:
				"Daniel Cosmo's (kuzminklk) personal website about development, photography, sport…",
			images: ["/open-graph.png"],
		},
		verification: {
			google: "Lhm9hi-5ff4o9Inx9OTOaQzlnoxhvPpdFW6HJcwk__c",
		},
	}
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }))
}

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

	return (
		<html
			lang={locale}
			className={`${amstelvar.className} ${redHatMono.className} ${notoSansMono.className}`}
		>
			<body>
				<NextIntlClientProvider>
					<Header />
					{children}
					<Footer />
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
