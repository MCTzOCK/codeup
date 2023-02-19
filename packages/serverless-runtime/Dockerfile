FROM node:18
WORKDIR /codeup-serverless-function
COPY package.json .
COPY index.js .
RUN npm install
EXPOSE 3000
CMD ["node", "index.js"]