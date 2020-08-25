#!/bin/sh
yarn
yarn run build
node ./dist/bin/server.js

