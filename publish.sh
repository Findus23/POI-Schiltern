#!/bin/bash
rsync -rvzP ./dist/ lukas@78.46.212.140:/var/www/karte/ --fuzzy --delete-after -v
