docker run -p 80:3000 -ti --network iov-poc-ingress --rm -v `pwd`:/app -w /app node:lts-alpine3.12 node ./dist/bin/server.js
