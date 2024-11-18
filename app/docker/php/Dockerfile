# Use composer image to install dependencies
FROM composer:latest as composer

FROM lendableuk/php-fpm-alpine:8.2.5-alpine3.16

# Install required system packages
RUN apk add --no-cache \
    bash=~5.1 \
    git=~2.36 \
    icu-dev=~71.1 \
    make=~4.3 \
    postgresql-dev # Install PostgreSQL development package

# Install Composer in the PHP stage
COPY --from=composer /usr/bin/composer /usr/bin/composer

# Set up PHP extensions
RUN mkdir -p /usr/src/app \
    && apk add --no-cache --virtual=.build-deps \
        autoconf=~2.71 \
        g++=~11.2 \
    && docker-php-ext-configure intl \
    && docker-php-ext-install intl pdo pdo_pgsql \
    && pecl install apcu \
    && docker-php-ext-enable apcu intl

# Set working directory
WORKDIR /usr/src/app

# Copy composer files and install dependencies
COPY ./app/composer.json /usr/src/app/composer.json
COPY ./app/composer.lock /usr/src/app/composer.lock

RUN composer install --no-scripts

# Copy application files
COPY ../../app/* /usr/src/app

# Change ownership to non-root user
RUN chown -R 1000:1000 /usr/src/app
RUN mkdir /run/php \
    && chown -R 1000:1000 /run/php

# Switch to non-root user
USER 1000:1000