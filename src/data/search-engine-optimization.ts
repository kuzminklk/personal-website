export const websiteURL = "https://kuzminklk.vercel.app"

export function absoluteUrl(path: string) {
	return new URL(path, websiteURL).toString()
}
