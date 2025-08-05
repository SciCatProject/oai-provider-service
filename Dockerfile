FROM node:20-slim

WORKDIR /home/node/app

COPY package*.json /home/node/app/
COPY . /home/node/app/

RUN npm install -g npm

RUN npm install
RUN npm ci
RUN npm run clean
RUN npm run build

CMD ["npm", "run", "start"]
