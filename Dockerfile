FROM node:14-alpine

WORKDIR /home/node/app
RUN chown -R node:node /home/node/app

USER node
COPY package*.json /home/node/app/
COPY . /home/node/app/

RUN npm ci
RUN npm run compile

CMD ["npm", "start"]
