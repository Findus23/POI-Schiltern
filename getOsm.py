#!/usr/bin/env python3
import json
import os.path
import shutil
from pprint import pprint

import overpass
from shapely.geometry.polygon import LinearRing, LineString

from settings import *

if not os.path.isfile("response.geo.json"):
    request = "("
    for key in keys:
        values = keys[key]
        for value in values:
            keyValue = "'" + key + "'='" + value + "'"
            print(keyValue)
            request += "node[" + keyValue + "]" + area + ";way[" + keyValue + "]" + area + ";"
            icon = keys[key][value]["icon"]
            shutil.copyfile("icons/" + icon + ".png", "images/" + icon + ".png")
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
        if len(feature["geometry"]["coordinates"]) == 2:
            ring = LineString(feature["geometry"]["coordinates"])
        else:
            ring = LinearRing(feature["geometry"]["coordinates"])
        ctr = list(ring.centroid.coords)[0]
        feature["geometry"]["coordinates"] = ctr
        feature["geometry"]["type"] = "Point"
    searchKeys = list(set(keys).intersection(feature["properties"]))
    i = 0
    searchValue = feature["properties"][searchKeys[i]]
    while searchValue not in keys[searchKeys[i]]:
        i += 1
        searchValue = feature["properties"][searchKeys[i]]
    own = keys[searchKeys[i]][searchValue]
    feature["properties"]["own"] = own

with open('poi.json', 'w') as outfile:
    json.dump(data, outfile, indent=4, sort_keys=True)
