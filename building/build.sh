#!/bin/sh

rm -rf dist

npx rollup -c

# Replace <hash> in file with hash of the built file
hash="$(sha512sum dist/index.js | cut -d" " -f1)"

echo $hash

sed -i "s/<hash>/$hash/g" dist/index.js

changelog="$(node building/generateChangelogJson.js)"

echo $changelog

sed -i "s/<changelog>/$changelog/g" dist/index.js

# Remove the auto-added map comment line as to not trigger the client trying to get the map
# sed -i '$ d' dist/index.js