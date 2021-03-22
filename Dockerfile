FROM node:14-alpine as BUILD

WORKDIR /var/www/web

COPY . ./

RUN export NODE_ENV=production && \
  yarn install --prod -s && \
  yarn build && \
  yarn remove prisma --prod -s

FROM alpine:latest

RUN apk add --no-cache --update nodejs yarn

COPY --from=BUILD /var/www/web /

EXPOSE 9000

CMD ["yarn", "start"]
