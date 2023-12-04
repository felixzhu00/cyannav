FROM node:18-alpine as builder

WORKDIR /app/

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD ["node", "index.js"]

