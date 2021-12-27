FROM node

ENV NODE_ENV development
ENV PORT 3000

EXPOSE 80 443 3000

RUN mkdir -p /client/src/app
WORKDIR /client/src/app

COPY package*.json /client/src/app/
RUN yarn install

COPY . /client/src/app

CMD "yarn" "dev"