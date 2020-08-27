docker run -p 80:3000 -td --network iov-poc-ingress --env sdkMspId=Org1MSP --rm -v `pwd`:/app -w /app node:lts-alpine3.12 node ./dist/bin/server.js
docker run -p 90:3000 -td --network iov-poc-ingress --env sdkMspId=Org2MSP --rm -v `pwd`:/app -w /app node:lts-alpine3.12 node ./dist/bin/server.js
docker run -p 100:3000 -td --network iov-poc-ingress --env sdkMspId=Org3MSP --rm -v `pwd`:/app -w /app node:lts-alpine3.12 node ./dist/bin/server.js
