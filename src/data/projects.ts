import { StaticImageData } from "next/image"
import cosmosCompanyDesktop from "@/assets/projects/cosmos-company-desktop.png"
import centralParkDesktop from "@/assets/projects/central-park-desktop.png"
import belarusDigitalDesktop from "@/assets/projects/belarus-digital-desktop.png"
import cosmosCompanyMobile from "@/assets/projects/cosmos-company-mobile.jpg"
import centralParkMobile from "@/assets/projects/central-park-mobile.jpg"
import belarusDigitalMobile from "@/assets/projects/belarus-digital-mobile.jpg"
import strawberryVendorDesktop from "@/assets/projects/strawberry-token-desktop.png"
import buyMeACoffeeDesktop from "@/assets/projects/buy-me-a-coffee-desktop.png"
import mobyDickDesktop from "@/assets/projects/moby-dick-desktop.png"
import strawberryVendorMobile from "@/assets/projects/strawberry-token-mobile.jpg"
import buyMeACoffeeMobile from "@/assets/projects/buy-me-a-coffee-mobile.jpg"
import mobyDickMobile from "@/assets/projects/moby-dick-mobile.jpg"
import cosmosCompanyPixel from "@/assets/projects/cosmos-company-pixel.webp"
import centralParkPixel from "@/assets/projects/central-park-pixel.webp"
import belarusDigitalPixel from "@/assets/projects/belarus-digital-pixel.webp"
import strawberryVendorPixel from "@/assets/projects/strawberry-token-pixel.webp"
import buyMeACoffeePixel from "@/assets/projects/buy-me-a-coffee-pixel.webp"
import mobyDickPixel from "@/assets/projects/moby-dick-pixel.webp"

type Project = {
	id: string
	github: string
	deployment: string
	desktopImage: StaticImageData
	mobileImage: StaticImageData
	/** Pixelated preview revealed on hover. */
	pixelImage: StaticImageData
}

export const projects: Project[] = [
	{
		id: "cosmos-company",
		pixelImage: cosmosCompanyPixel,
		github: "https://github.com/kuzminklk/cosmos-company",
		deployment: "https://cosmos-company.vercel.app/",
		desktopImage: cosmosCompanyDesktop,
		mobileImage: cosmosCompanyMobile,
	},
	{
		id: "central-park",
		pixelImage: centralParkPixel,
		github: "https://github.com/kuzminklk/central-park",
		deployment: "https://central-park-volkovysk.vercel.app/",
		desktopImage: centralParkDesktop,
		mobileImage: centralParkMobile,
	},
	{
		id: "belarus-digital",
		pixelImage: belarusDigitalPixel,
		github: "https://github.com/kuzminklk/belarus-digital",
		deployment: "https://belarus-digital.vercel.app/",
		desktopImage: belarusDigitalDesktop,
		mobileImage: belarusDigitalMobile,
	},
	{
		id: "strawberry-vendor",
		pixelImage: strawberryVendorPixel,
		github: "https://github.com/kuzminklk/erc-20",
		deployment: "https://strawberry-vendor.vercel.app/",
		desktopImage: strawberryVendorDesktop,
		mobileImage: strawberryVendorMobile,
	},
	{
		id: "buy-me-a-coffee",
		pixelImage: buyMeACoffeePixel,
		github: "https://github.com/kuzminklk/buy-me-a-coffee",
		deployment: "https://buy-me-a-coffee-pixelated.vercel.app/",
		desktopImage: buyMeACoffeeDesktop,
		mobileImage: buyMeACoffeeMobile,
	},
	{
		id: "moby-dick",
		pixelImage: mobyDickPixel,
		github: "https://github.com/kuzminklk/moby-dick",
		deployment: "https://moby-dick-pi.vercel.app/",
		desktopImage: mobyDickDesktop,
		mobileImage: mobyDickMobile,
	},
]
