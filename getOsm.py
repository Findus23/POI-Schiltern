#!/usr/bin/env python3
import json
import os.path
import shutil
from pprint import pprint
import yaml
import overpass
from shapely.geometry.polygon import LinearRing, LineString, Polygon
from shapely.algorithms.polylabel import polylabel

with open("config.yaml", 'r') as stream:
    try:
        config = yaml.load(stream)
    except yaml.YAMLError as exc:
        print(exc)
        config = False
        exit()
area = config["area"]
keys = config["keys"]

if not os.path.isfile("response.geo.json") or True:
    areastring = "(" + ",".join(str(i) for i in area) + ")"
    request = "("
    for key in keys:
        values = keys[key]
        for value in values:
            keyValue = "'" + key + "'='" + value + "'"
            print(keyValue)
            request += "node[" + keyValue + "]" + areastring + ";way[" + keyValue + "]" + areastring + ";"
            icon = keys[key][value]["icon"]
            shutil.copyfile("icons/" + icon + ".png", "public/images/" + icon + ".png")
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
            print("Line")
            line = LineString(feature["geometry"]["coordinates"])
            labelpoint = list(line.representative_point().coords)[0]
        else:
            poly = Polygon(feature["geometry"]["coordinates"])
            labelpoint = list(polylabel(poly).coords)[0]
        feature["geometry"]["coordinates"] = labelpoint
        feature["geometry"]["type"] = "Point"
    searchKeys = list(set(keys).intersection(feature["properties"]))
    i = 0
    searchValue = feature["properties"][searchKeys[i]]
    while searchValue not in keys[searchKeys[i]]:
        i += 1
        searchValue = feature["properties"][searchKeys[i]]
    own = keys[searchKeys[i]][searchValue]
    feature["properties"]["own"] = own

with open('additionalPois.json') as inputfile:
    additional = json.load(inputfile)

data["features"] += additional["features"]
with open('public/poi.json', 'w') as outfile:
    json.dump(data, outfile, indent=4, sort_keys=True)
