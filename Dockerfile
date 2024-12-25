FROM node:18
LABEL maintainer="Ben Siebert"

RUN mkdir -p /usr/src/app
RUN mkdir /usr/src/cws
WORKDIR /usr/src/app

RUN apt update
RUN apt install -y openjdk-17-jre-headless
RUN mkdir -p /etc/codeup/cws
RUN wget -O /etc/codeup/cws/workspaces.jar https://download.ben-siebert.com/codeup/internal/workspaces/latest/workspaces.jar

RUN npm i -g turbo
COPY ./ /usr/src/app/
RUN yarn config set enableStrictSsl false
RUN yarn && turbo run build --filter=@codeup/web
EXPOSE 3000
CMD yarn --cwd apps/web ts-start-prod
