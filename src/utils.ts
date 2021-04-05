import arch from "../icons/arch.png"
import atm2 from "../icons/atm-2.png"
import bread from "../icons/bread.png"
import brewery1 from "../icons/brewery1.png"
import fillingstation from "../icons/fillingstation.png"
import postal from "../icons/postal.png"
import firstaid from "../icons/firstaid.png"
import taxi from "../icons/taxi.png"
import medicine from "../icons/medicine.png"
import winetasting from "../icons/winetasting.png"
import restaurant from "../icons/restaurant.png"
import information from "../icons/information.png"
import water from "../icons/water.png"
import playground from "../icons/playground.png"
import supermarket from "../icons/supermarket.png"
import sight2 from "../icons/sight-2.png"
import castle2 from "../icons/castle-2.png"
import coffee from "../icons/coffee.png"

export function nameToIcon(name: string): string {
    switch (name) {
        case "amenity=cafe":
            return coffee
        case "amenity=post_office":
            return postal
        case "amenity=post_box":
            return postal
        case "amenity=fuel":
            return fillingstation
        case "amenity=atm":
            return atm2
        case "amenity=doctors":
            return medicine
        case "amenity=pharmacy":
            return firstaid
        case "amenity=taxi":
            return taxi
        case "cuisine=heuriger":
            return winetasting
        case "information=office":
            return information
        case "cuisine=regional":
            return restaurant
        case "leisure=playground":
            return playground
        case "leisure=sea_bath":
            return water
        case "shop=bakery":
            return bread
        case "shop=supermarket":
            return supermarket
        case "tourism=attraction":
            return sight2
        case "tourism=museum":
            return arch
        case "craft=brewery":
            return brewery1
        case "historic=castle":
            return castle2
        default:
            return information
    }
}


export function toName(key: string, value: string): string {
    const kv = key + "=" + value
    switch (kv) {
        case "amenity=cafe":
            return "Cafe"
        case "amenity=post_office":
            return "Postamt"
        case "amenity=post_box":
            return "Briefkasten"
        case "amenity=fuel":
            return "Tankstelle"
        case "amenity=atm":
            return "Geldautomat"
        case "amenity=doctors":
            return "Arzt"
        case "amenity=pharmacy":
            return "Apotheke"
        case "amenity=taxi":
            return "Taxi-Stand"
        case "cuisine=heuriger":
            return "Heuriger"
        case "information=office":
            return "Touristeninformation"
        case "cuisine=regional":
            return "Gasthaus"
        case "leisure=playground":
            return "Spielplatz"
        case "leisure=sea_bath":
            return "Badeteich"
        case "shop=bakery":
            return "Bäckerei"
        case "shop=supermarket":
            return "Supermarkt"
        case "tourism=attraction":
            return "Sehenswürdigkeit"
        case "tourism=museum":
            return "Museum"
        case "craft=brewery":
            return "Brauerei"
        case "historic=castle":
            return "Schloss"
        default:
            return "Unbekannt"
    }
}
