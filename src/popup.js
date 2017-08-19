import opening_hours from "opening_hours";
import moment from "moment";


function getPopupText(feature) {
    moment.locale(window.navigator.userLanguage || window.navigator.language);
    let popuptext = "";
    if (feature.properties.name) {
        popuptext += feature.properties.name + "<br>";
    }
    if (feature.properties.website) {
        popuptext += "<a href='" + feature.properties.website + "' target='_blank' rel='noopener'>" + feature.properties.website + "</a><br>";
    }

    if (feature.properties.phone) {
        popuptext += "Tel: <a href='tel:" + feature.properties.phone + "'>" + feature.properties.phone + "</a><br>";
    }
    if (feature.properties.opening_hours) {
        let oh = new opening_hours(feature.properties.opening_hours, {
            "address": {
                "state": "Niederösterreich",
                "country": "Österreich",
                "country_code": "at"
            }
        });
        if (!oh.getUnknown()) {
            let change = moment(oh.getNextChange());
            if (oh.getState()) {
                popuptext += "hat geöffnet<br>schließt " + change.calendar() + " (" + change.fromNow() + ")";
            } else {
                popuptext += "hat geschlossen<br>öffnet " + change.calendar() + " (" + change.fromNow() + ")";
            }
        }
    }
    return popuptext;
}

export default getPopupText;