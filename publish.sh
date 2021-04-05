#!/bin/bash
rsync -rvzP ./public/ lukas@lw1.at:/var/www/karte/ --fuzzy --delete-after -v
