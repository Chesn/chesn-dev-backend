FROM node:14-alpine as BUILD

WORKDIR /var/www/backend

COPY . ./

RUN export NODE_ENV=production && \
  yarn install --prod -s && \
  yarn build && \
  yarn remove prisma --prod -s

FROM keymetrics/pm2:14-alpine

COPY --from=BUILD /var/www/backend /

EXPOSE 9000

CMD ["pm2-runtime", "start", "pm2.json"]
