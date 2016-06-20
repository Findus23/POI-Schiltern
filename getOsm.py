#!/bin/python3
from pprint import pprint
import overpass
import json
import os.path
import statistics
from shapely.geometry.polygon import LinearRing

area = "(48.44320894553832,15.552864074707033,48.5501374010859,15.755767822265625)"
keys = {
    "shop": [
        "bakery",
        "supermarket"
    ],
    "amenity": [
        "post_office"
    ]
}
if not os.path.isfile("response.geo.json"):
    request = "("
    for key in keys:
        values = keys[key]
        for value in values:
            print(key + ":" + value)
            keyValue = "'" + key + "'='" + value + "'"
            request += "node[" + keyValue + "]" + area + ";way[" + keyValue + "]" + area + ";"

    request += ");"

    api = overpass.API()
    data = api.Get(request, responseformat="geojson")
    with open('response.geo.json', 'w') as outfile:
        json.dump(data, outfile, indent=4, sort_keys=True)

else:
    with open('response.geo.json') as inputfile:
        data = json.load(inputfile)

for feature in data["features"]:
    if feature["geometry"]["type"] == "Point":
        print("Point")
    else:
        ring = LinearRing(feature["geometry"]["coordinates"])
        ctr = list(ring.centroid.coords)[0]
        feature["geometry"]["coordinates"] = ctr
        feature["geometry"]["type"] = "Point"
        pprint(feature["geometry"])

with open('test.geo.json', 'w') as outfile:
    json.dump(data, outfile, indent=4, sort_keys=True)
