docker run -td --network iov-poc-ingress --rm -v `pwd`:/app -w /app node:lts-alpine3.12 --expose 80:3000/tcp node ./dist/bin/server.js
