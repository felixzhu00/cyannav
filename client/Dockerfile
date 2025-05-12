FROM cypress/base as builder

WORKDIR /app/

COPY package.json .

RUN npm i

COPY . .

RUN npm run build

FROM nginx
EXPOSE 80 443


# UNCOMMENT the following if you want a http server

COPY ./nginx/http-nginx.conf /etc/nginx/conf.d/default.conf

# UNCOMMENT the following if you want a https server
# REQUIRES certbot with valid certification in /etc/letsencrypt
# modify default.conf as necessary

# COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# COPY --from=builder /app/build /usr/share/nginx/html