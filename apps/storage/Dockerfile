FROM node:16

WORKDIR /codeup-storage-server

COPY . .

RUN npm install

EXPOSE 3000

ENTRYPOINT ["node", "src/index.js"]