FROM cypress/base as builder

WORKDIR /app/

COPY package.json .

RUN npm i --force

COPY . .

FROM cyannav-api as backend

RUN npm test

RUN npm run build
RUN ls /app/build

FROM nginx
EXPOSE 80

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

RUN ls /usr/share/nginx/html