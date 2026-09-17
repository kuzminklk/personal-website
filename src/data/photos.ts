import { StaticImageData } from "next/image"
import natasha from "@/assets/photos/natasha.jpg"
import asyaAtFall from "@/assets/photos/asya-at-fall.jpg"
import springFlowers from "@/assets/photos/spring.jpg"
import dashaAtNight from "@/assets/photos/dasha-at-night.jpg"
import flowers from "@/assets/photos/flowers.jpg"
import dasha from "@/assets/photos/dasha.jpg"
import vova from "@/assets/photos/vova.jpg"
import misha from "@/assets/photos/misha.jpg"
import anya from "@/assets/photos/anya.jpg"
import asya from "@/assets/photos/asya.jpg"

type Photo = {
	source: StaticImageData
	id: string
	orientation: "portrait" | "landscape"
}

export const photos: Photo[] = [
	{ source: asya, id: "asya", orientation: "portrait" },
	{ source: springFlowers, id: "spring-flowers", orientation: "landscape" },
	{ source: natasha, id: "natasha", orientation: "portrait" },
	{ source: asyaAtFall, id: "asya-at-fall", orientation: "portrait" },
	{ source: vova, id: "vova", orientation: "portrait" },
	{ source: flowers, id: "flowers", orientation: "landscape" },
	{ source: dasha, id: "dasha", orientation: "portrait" },
	{ source: dashaAtNight, id: "dasha-at-night", orientation: "portrait" },
	{ source: misha, id: "misha", orientation: "portrait" },
	{ source: anya, id: "anya", orientation: "portrait" },
]
