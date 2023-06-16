FROM node:18
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN npm i -g turbo
COPY ./ /usr/src/app/
RUN yarn && turbo run build --filter=web
EXPOSE 3000
CMD yarn --cwd apps/web ts-start-prod