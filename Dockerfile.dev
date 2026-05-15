# syntax=docker/dockerfile:1.7

FROM node:22-alpine

WORKDIR /app

EXPOSE 3001

CMD ["sh", "-c", "npm install --no-audit --fund=false --progress=false && npm run dev"]
