FROM cypress/base as builder

WORKDIR /app/

COPY package.json .

RUN npm i

COPY . .

RUN npm run build

FROM nginx
EXPOSE 80 443

COPY /etc/letsencrypt/live/cyannav.tech-0001/fullchain.pem /etc/ssl/cyannav.tech.pem
COPY /etc/letsencrypt/live/cyannav.tech-0001/privkey.pem /etc/ssl/cyannav.tech.key

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html