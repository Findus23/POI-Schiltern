// @ts-ignore
import opening_hours from "opening_hours";
import {toName} from "./utils";
import {DateTime} from 'luxon';

export function getPopupText(feature: GeoJSON.Feature) {
    let popuptext = [];
    let prop = feature.properties;
    if (prop.name) {
        popuptext.push(prop.name);
    } else {
        popuptext.push(toName(prop.key, prop.value));
    }
    if (prop.website) {
        popuptext.push("<a href='" + prop.website + "' target='_blank' rel='noopener'>" + prop.website + "</a>");
    }

    if (prop.phone) {
        popuptext.push("Tel: <a href='tel:" + prop.phone + "'>" + prop.phone + "</a>");

    }
    if (prop.email) {
        popuptext.push("E-Mail: <a href='tel:" + prop.email + "'>" + prop.email + "</a>");
    }
    if (prop.opening_hours) {
        try {
            let oh = new opening_hours(prop.opening_hours, {
                lat: 48.513969429467124,
                lon: 15.628936886787415,
                "address": {
                    "state": "Niederösterreich",
                    "country_code": "at"
                }
            });
            if (!oh.getUnknown()) {
                let openText;
                let change = DateTime.fromJSDate(oh.getNextChange());
                if (oh.getState()) {
                    openText = "hat geöffnet<br>schließt ";
                } else {
                    openText = "hat geschlossen<br>öffnet ";
                }
                if (oh.getNextChange()) {
                    openText += change.toRelativeCalendar() + " (" + change.toRelative() + ")";
                } else {
                    openText += "nie"
                }
                popuptext.push(openText);
            }
        } catch (e) {
            console.warn(e);
        }
    }
    return popuptext.join("<br>");
}

