#!/bin/bash
rsync -rvzP ./dist/ lukas@lw1.at:/var/www/karte/ --fuzzy --delete-after -v
