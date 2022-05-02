FROM node:12.22.10 as build-stage

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY ./ .

RUN yarn build


FROM nginx:stable-alpine as production-stage

RUN rm -rf /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]
