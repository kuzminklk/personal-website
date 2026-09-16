import * as rootParameters from "next/root-params"
import { notFound } from "next/navigation"
import { getRequestConfig } from "next-intl/server"
import { hasLocale } from "next-intl"
import { routing } from "./routing"

export default getRequestConfig(async ({ locale }) => {
	if (!locale) {
		const parametersValue = await rootParameters.locale()
		if (hasLocale(routing.locales, parametersValue)) {
			locale = parametersValue
		} else {
			notFound()
		}
	}
	return {
		locale,
		messages: (await import(`../messages/${locale}.json`)).default,
	}
})
