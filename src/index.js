import "leaflet/dist/leaflet.css";
import "./style.css";
import poi from "../data/poi.json";
import L from "leaflet";

const moment = require('moment');
import opening_hours from "opening_hours";

document.addEventListener('DOMContentLoaded', function() {
    moment.locale(window.navigator.userLanguage || window.navigator.language);
    let map = L.map('map').setView([48.51579416571888, 15.6255304813385], 16);
    // let layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     maxZoom: 19,
    //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    // }).addTo(map);
    let layer = L.tileLayer('').addTo(map);
    let LeafIcon = L.Icon.extend({
        options: {
//            shadowUrl: 'leaf-shadow.png',
//         //   iconSize:     [38, 95],
//            shadowSize:   [50, 64],
            iconAnchor: [16, 35],
            popupAnchor: [0, -35]
        }
    });

    let categories = {},
        category;

    let geojsonLayer = L.geoJson(null, {
        pointToLayer: function(feature, latlng) {
            let iconfile = require("../data/images/" + feature.properties.own.icon + '.png');
            return L.marker(latlng, {icon: new LeafIcon({iconUrl: iconfile})});
        },
        onEachFeature: function(feature, layer) {
            // Check if feature is a polygon
            if (feature.geometry.type === 'Polygon') {
                // Don't stroke and do opaque fill
                layer.setStyle({
                    'weight': 0,
                    'fillOpacity': 0
                });
                // Get center of bounds
                let center = layer.getBounds().getCenter();
                // Use center to put marker on map
                let iconfile = require("../data/images/" + feature.properties.own.icon + '.png');
                layer = L.marker(center, {icon: new LeafIcon({iconUrl: iconfile})}).addTo(map);
            } else {
            }
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
//                    console.warn(oh.getState());
//                    popuptext += oh.getState();
            }
            if (popuptext) {
                layer.bindPopup(popuptext);
            }

            category = feature.properties.own.category;
            // Initialize the category array if not already set.
            if (typeof categories[category] === "undefined") {
                categories[category] = [];
            }
            categories[category].push(layer);
        }
    });
    let mapLayers = {
        'Standard': layer
    };

    let attribution = function() {
        return 'Icons von <a href="https://mapicons.mapsmarker.com">mapicons.mapsmarker.com</a> ' +
            '(<a href="http://creativecommons.org/licenses/by-sa/3.0/">CC BY SA 3.0</a>)';
    };
    let overlays = {};
    let categoryName, categoryArray, categoryLG;

    geojsonLayer.addData(poi);
    map.fitBounds(geojsonLayer.getBounds());
    for (categoryName in categories) {
        categoryArray = categories[categoryName];
        categoryLG = L.layerGroup(categoryArray);

        categoryLG.categoryName = categoryName;
        categoryLG.getAttribution = attribution;

        overlays[categoryName] = categoryLG;

        categoryLG.addTo(map);
    }
    let control = L.control.layers(mapLayers, overlays).addTo(map);

    // L.control.locate().addTo(map);
}, false);
