# FROM node:12.13.1 AS builder

# WORKDIR /home/node
# COPY --chown=node:node . .
# RUN npm i -g yarn

# USER node

# RUN yarn install
# RUN ./scripts/build.sh

FROM nginx:mainline-alpine

COPY ./build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000