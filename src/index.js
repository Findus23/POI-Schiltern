import "leaflet/dist/leaflet.css";
import "./style.css";
import poi from "../data/poi.json";
import L from "leaflet";

import getPopupText from "./popup";

document.addEventListener('DOMContentLoaded', function() {
    let map = L.map('map').setView([48.51579416571888, 15.6255304813385], 16);
    let layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    let blankLayer = L.tileLayer('').addTo(map);
    let LeafIcon = L.Icon.extend({
        options: {
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
            let popuptext = getPopupText(feature);
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
        "Leer": blankLayer,
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
