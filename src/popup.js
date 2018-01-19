import opening_hours from "opening_hours";
import moment from "moment";


function getPopupText(feature) {
    moment.locale(window.navigator.userLanguage || window.navigator.language);
    let popuptext = [];
    let prop = feature.properties;
    if (prop.name) {
        popuptext.push(prop.name);
    } else {
        popuptext.push(prop.own.category);
    }
    if (prop.website) {
        popuptext.push("<a href='" + prop.website + "' target='_blank' rel='noopener'>" + prop.website + "</a>");
    }

    if (prop.phone) {
        popuptext.push("Tel: <a href='tel:" + prop.phone + "'>" + prop.phone + "</a>");

    }
    if (prop.email) {
        popuptext.push("Tel: <a href='tel:" + prop.email + "'>" + prop.email + "</a>");
    }
    if (prop.opening_hours) {
        let oh = new opening_hours(prop.opening_hours, {
            "address": {
                "state": "Niederösterreich",
                "country": "Österreich",
                "country_code": "at"
            }
        });
        if (!oh.getUnknown()) {
            let openText;
            let change = moment(oh.getNextChange());
            if (oh.getState()) {
                openText = "hat geöffnet<br>schließt ";
            } else {
                openText = "hat geschlossen<br>öffnet ";
            }
            openText += change.calendar() + " (" + change.fromNow() + ")";
            popuptext.push(openText);
        }
    }
    return popuptext.join("<br>");
}

export default getPopupText;
