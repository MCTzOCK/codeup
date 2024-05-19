# Serverless Runtimes
docker pull node:latest
docker pull python:bullseye
docker pull golang:latest
docker pull mctzock/codeup-serverless-runtime:latest
docker pull mctzock/codeup-tsx-rce:latest
docker pull mctzock/codeup-java-rce:latest

docker image tag node:latest rce-node:codeup
docker image tag python:bullseye rce-python:codeup
docker image tag golang:latest rce-golang:codeup
docker image tag mctzock/codeup-serverless-runtime:latest rce-sf-runtime:codeup
docker image tag mctzock/codeup-tsx-rce:latest rce-tsx:codeup
docker image tag mctzock/codeup-java-rce:latest rce-java:codeup

