FROM nginx:1.25-alpine

RUN apk update \
    && apk add nginx 

RUN adduser -D -g 'www' www \
    && mkdir /www \
    && chown -R www:www /var/lib/nginx \
    && chown -R www:www /www 

WORKDIR /usr/src/app

COPY ../../* /usr/src/app

RUN chown -R 1000:1000 /usr/src/app
USER 1000:1000