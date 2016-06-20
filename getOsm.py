#!/bin/python3
from pprint import pprint
import os.path
import shutil
import overpass
import json
import statistics
from shapely.geometry.polygon import LinearRing

area = "(48.44320894553832,15.552864074707033,48.5501374010859,15.755767822265625)"
keys = {
    "shop": {
        "bakery": {
            "category": "Bäkerei",
            "icon": "bread"
        },
        "supermarket": {
            "category": "Supermarkt",
            "icon": "supermarket"
        }
    },
    "amenity": {
        "post_office": {
            "category": "Postamt",
            "icon": "postal"
        },
        "school": {
            "category": "Schule",
            "icon": "school"
        }
    }
}
if not os.path.isfile("response.geo.json") or True:
    request = "("
    for key in keys:
        values = keys[key]
        for value in values:
            print(key + ":" + value)
            keyValue = "'" + key + "'='" + value + "'"
            request += "node[" + keyValue + "]" + area + ";way[" + keyValue + "]" + area + ";"
            icon = keys[key][value]["icon"]
            shutil.copyfile("icons/" + icon + ".png", "images/" + icon + ".png")
            pprint(icon)

    request += ");"
    api = overpass.API()
    data = api.Get(request, responseformat="geojson")
    with open('response.geo.json', 'w') as outfile:
        json.dump(data, outfile, indent=4, sort_keys=True)

else:
    with open('response.geo.json') as inputfile:
        data = json.load(inputfile)

for feature in data["features"]:
    if feature["geometry"]["type"] == "LineString":
        ring = LinearRing(feature["geometry"]["coordinates"])
        ctr = list(ring.centroid.coords)[0]
        feature["geometry"]["coordinates"] = ctr
        feature["geometry"]["type"] = "Point"
    searchKey = list(set(keys).intersection(feature["properties"]))[0]
    searchValue = feature["properties"][searchKey]
    feature["properties"]["own"] = keys[searchKey][searchValue]

with open('poi.json', 'w') as outfile:
    json.dump(data, outfile, indent=4, sort_keys=True)
