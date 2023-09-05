FROM node:18-alpine

WORKDIR /home/node/app
COPY package*.json /home/node/app/


RUN npm config set registry http://registry.npmjs.org/
RUN npm config set strict-ssl false
RUN npm ci

COPY --chown=node:node . /home/node/app/
COPY --chown=node:node CI/ESS/mongo-dao.ts /home/node/app/src/providers/scicat-provider/dao/mongo-dao.ts
COPY --chown=node:node CI/ESS/scicat-dc-mapper.ts /home/node/app/src/providers/scicat-provider/repository/scicat-dc-mapper.ts
COPY --chown=node:node CI/ESS/configuration.ts /home/node/app/src/providers/scicat-provider/repository/configuration.ts

RUN npm run compile
ENV NODE_ENV="production"
RUN npm prune

WORKDIR /home/node/app/dist/

CMD ["node", "index.js"]