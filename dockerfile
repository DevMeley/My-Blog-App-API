FROM node:23.1 AS slim

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . .

EXPOSE 2300

CMD [ "npm", "start" ]