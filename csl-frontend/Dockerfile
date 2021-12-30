FROM node

RUN mkdir -p /client
WORKDIR /client

COPY package*.json /client/
RUN yarn install

COPY . /client

CMD "yarn" "dev"