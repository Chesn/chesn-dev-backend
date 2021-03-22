FROM node:14-alpine

RUN openssl version -v
RUN uname -a
RUN echo $DATABASE_URL

WORKDIR /var/www/database

RUN npm install -g prisma --unsafe-perm

ADD ./ ./prisma/

CMD [ "prisma", "migrate", "up", "--experimental"]
