FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

ENV NODE_ENV=production

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npx", "nodemon", "app.js"]
