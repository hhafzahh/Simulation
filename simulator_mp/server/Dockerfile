#using a base node image
FROM node:12-alpine as build-step

# set working directory
WORKDIR /usr/src/app

# install and cache app dependencies
COPY package.json /usr/src/app
RUN npm install

# add app
COPY . /usr/src/app

# Expose the port the app runs in#
EXPOSE 3000

# start server
CMD ["node","server.js"]