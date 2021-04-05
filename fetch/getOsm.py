#!/usr/bin/env python3
import json
import os.path

import overpass
import yaml
from shapely.algorithms.polylabel import polylabel
from shapely.geometry.polygon import LineString, Polygon

with open("config.yaml", 'r') as stream:
    try:
        config = yaml.safe_load(stream)
    except yaml.YAMLError as exc:
        print(exc)
        config = False
        exit()
area = config["area"]
keys = config["keys"]

if not os.path.isfile("response.geo.json") or True:
    areastring = "(around:{radius},{lat},{lon})".format(radius=area["radius"], lat=area["lat"], lon=area["lon"])
    request = "("
    for key in keys:
        values = keys[key]
        for value in values:
            keyValue = f"'{key}'='{value}'"
            request += f"node[{keyValue}]{areastring};\n"
            request += f"way[{keyValue}]{areastring};\n"
    request += ");"
    request += "out geom;"
    print(request)
    api = overpass.API()
    data = api.Get(request, responseformat="geojson")
    print("request finished")
    with open('response.geo.json', 'w') as outfile:
        json.dump(data, outfile, indent=4, sort_keys=True, ensure_ascii=False)

else:
    with open('response.geo.json') as inputfile:
        data = json.load(inputfile)

filteredFeatures = []
for feature in data["features"]:
    if "name" in feature["properties"] and "Telefonzelle" in feature["properties"]["name"]:
        continue
    if not feature["geometry"]["coordinates"]:
        continue
    filteredFeatures.append(feature)

data["features"] = filteredFeatures

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
    # own = keys[searchKeys[i]][searchValue]
    feature["properties"]["key"] = searchKeys[i]
    feature["properties"]["value"] = searchValue

with open('additionalPois.json') as inputfile:
    additional = json.load(inputfile)

data["features"] += additional["features"]
with open('../data/poi.json', 'w') as outfile:
    json.dump(data, outfile, indent=4, sort_keys=True, ensure_ascii=False)
