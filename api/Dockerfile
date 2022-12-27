FROM node:18.9.0-alpine

WORKDIR /usr/src/app

COPY * .

RUN npm install
RUN npm run build

EXPOSE 8000
CMD [ "npm", "start" ]
