FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 7777

RUN npm run build
CMD ["node", "dist/index.js"]