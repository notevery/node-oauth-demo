FROM node

WORKDIR /oauth

COPY . /oauth

RUN npm install

CMD node index.js