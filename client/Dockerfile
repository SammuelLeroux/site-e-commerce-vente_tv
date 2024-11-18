FROM node:lts-alpine3.19

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY client/ .

RUN npm install
COPY . /usr/src/app

CMD ["npm","start"]