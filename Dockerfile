FROM node:18-alpine

WORKDIR /home/node/app

COPY package*.json /home/node/app/
COPY . /home/node/app/

RUN npm ci
RUN npm run compile

CMD ["npm", "start"]
