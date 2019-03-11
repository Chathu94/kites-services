FROM node:latest

COPY ./dist /src

WORKDIR /src

RUN ["npm", "install", "--production"]

EXPOSE 3010

CMD ["node", "index.js"]
