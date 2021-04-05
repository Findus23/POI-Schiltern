import "leaflet/dist/leaflet.css";
import "./style.css";
import poi from "../data/poi.json";
import L, {LatLng, Layer, TileLayerOptions} from "leaflet";

import {GeoJsonObject} from "geojson";
import {getPopupText} from "./popup";
import {nameToIcon, toName} from "./utils";

document.addEventListener('DOMContentLoaded', function () {
    let map = L.map('map').setView([48.51579416571888, 15.6255304813385], 13);
    const OpenStreetMapMapnik = L.tileLayer('https://maps.lw1.at/tiles/1.0.0/osm/GLOBAL_MERCATOR/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    const BasemapATbasemap = L.tileLayer("https://maps.lw1.at/tiles/1.0.0/basemap/GLOBAL_MERCATOR/{z}/{x}/{y}.{format}", {
        maxZoom: 19,
        attribution: 'Datenquelle: <a href="https://www.basemap.at">basemap.at</a>',
        subdomains: ["", "1", "2", "3", "4"],
        format: "png",
        bounds: [[46.35877, 8.782379], [49.037872, 17.189532]]
    } as TileLayerOptions);

// https://{s}.piano.tiles.quaidorsay.fr/fr/{z}/{x}/{y}.png
    const Piano = L.tileLayer('https://maps.lw1.at/tiles/1.0.0/piano/GLOBAL_MERCATOR/{z}/{x}/{y}.png', {
        attribution: 'Tiles <a href="https://github.com/tilery/pianoforte">PianoFr</a> | &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        minZoom: 0,
        maxZoom: 20,
    });

//https://{s}.forte.tiles.quaidorsay.fr/fr/{z}/{x}/{y}.png
    const Forte = L.tileLayer('https://maps.lw1.at/tiles/1.0.0/forte/GLOBAL_MERCATOR/{z}/{x}/{y}.png', {
        attribution: 'Tiles <a href="https://github.com/tilery/pianoforte">PianoFr</a> | &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        minZoom: 0,
        maxZoom: 20,
    });

// https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png
    const CyclOSM = L.tileLayer('https://maps.lw1.at/tiles/1.0.0/cyclOSM/GLOBAL_MERCATOR/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    let LeafIcon = L.Icon.extend({
        options: {
            iconAnchor: [16, 35],
            popupAnchor: [0, -35],
        }
    });

    let categories: { [name: string]: Layer[] } = {};

    let geojsonLayer = new L.GeoJSON(<unknown>[] as GeoJsonObject, {
        pointToLayer: function (feature: GeoJSON.Feature, latlng: LatLng) {
            const category = feature.properties.key + "=" + feature.properties.value;

            let iconfile = nameToIcon(category);
            return L.marker(latlng, {icon: new LeafIcon({iconUrl: iconfile})});
        },
        onEachFeature: function (feature, layer) {
            let popuptext = getPopupText(feature);
            layer.bindPopup(popuptext);
            const category = toName(feature.properties.key, feature.properties.value)
            // Initialize the category array if not already set.
            if (typeof categories[category] === "undefined") {
                categories[category] = [];
            }
            categories[category].push(layer);
        }
    });
    let mapLayers = {
        // "Leer": blankLayer,
        'Standard': OpenStreetMapMapnik,
        "Geländekarte": CyclOSM,
        // "Hell": Forte,
        // "Einfach": Piano,
        "Basemap.at": BasemapATbasemap,
    };

    let attribution = function () {
        return 'Icons von <a href="https://mapicons.mapsmarker.com">mapicons.mapsmarker.com</a> ' +
            '(<a href="http://creativecommons.org/licenses/by-sa/3.0/">CC BY SA 3.0</a>)' + " | " +
            '<a href="main.licenses.txt" target="_blank">Lizenzen</a> + ' +
            '<a href="https://github.com/Findus23/POI-Schiltern" target="_blank">Source</a>' +
            ' | <a href="https://www.ferienhaus-schiltern.at/impressum/" target="_blank">Impressum und Datenschutz</a>';
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
