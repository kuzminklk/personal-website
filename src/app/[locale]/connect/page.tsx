

import { getTranslations } from "next-intl/server"

import { Link } from "@/i18n/naviagation"
import styles from "./page.module.css";


export default async function Home() {
	const translations = await getTranslations("connect")

  return (
		<main className={styles.connect}>
			<section>
				<p>
					{translations.rich("telegram-and-telegram-channel", { 
            telegramLink: (chunks) => <Link href="https://t.me/kuzminklk" target="_blank" rel="noopener noreferrer">{chunks}</Link>, 
            telegramChannelLink: (chunks) => <Link target="_blank" href="https://t.me/kuzminklkk" rel="noopener noreferrer">{chunks}</Link>
          })}
				</p>
				<p>
					{translations.rich("tiktok-and-instagram", { 
            tiktokLink: (chunks) => <Link href="https://www.tiktok.com/@kuzminklk" target="_blank" rel="noopener noreferrer">{chunks}</Link>, 
            instagramLink: (chunks) => <Link href="https://www.youtube.com/@kuzminklk" target="_blank" rel="noopener noreferrer">{chunks}</Link>
          })}
				</p>
				<p>
					{translations.rich("github", { 
            githubLink: (chunks) => <Link href="https://github.com/kuzminklk" target="blank" rel="noopener noreferrer">{chunks}</Link>
          })}
				</p>
				<p>
					{translations.rich("unsplash", { 
						unsplashLink: (chunks) => <Link href="https://unsplash.com/@kuzminklk" target="_blank" rel="noopener noreferrer">{chunks}</Link>
					})}
				</p>
				<p>
					{translations.rich("linkedin", { 
						linkedinLink: (chunks) => <Link href="https://www.linkedin.com/in/kuzminklk/" target="_blank" rel="noopener noreferrer">{chunks}</Link>
					})}
				</p>
				<p>
					{translations.rich("devto-and-farcaster", { 
						devtoLink: (chunks) => <Link href="https://dev.to/kuzminklk" target="_blank" rel="noopener noreferrer">{chunks}</Link>,
						farcasterLink: (chunks) => <Link href="https://farcaster.xyz/kuzminklk" target="_blank" rel="noopener noreferrer">{chunks}</Link>
					})}
				</p>
			</section>
		</main>
	)
}
