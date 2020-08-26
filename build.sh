docker run --rm -v `pwd`:/app -w /app node:12.18 yarn run build
cp -r ./public ./dist/public
cp -r ./views ./dist/views
