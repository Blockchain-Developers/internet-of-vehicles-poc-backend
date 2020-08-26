docker run -td --network iov-poc-ingress --rm -v `pwd`:/app -w /app node:lts-alpine3.12 -p 127.0.0.1:80:3000/tcp node ./dist/bin/server.js
