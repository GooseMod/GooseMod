#!/bin/sh

rm -rf ./dist

npx parcel build src/index.js

hash="$(sha512sum dist/index.js | cut -d" " -f1)"

echo $hash

sed -i "s/<hash>/$hash/g" dist/index.js