#!/bin/sh

rm -rf ./dist

npx parcel build src/index.js

# Replace <hash> in file with hash of the built file
hash="$(sha512sum dist/index.js | cut -d" " -f1)"

echo $hash

sed -i "s/<hash>/$hash/g" dist/index.js