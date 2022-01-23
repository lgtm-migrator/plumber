FROM node

RUN mkdir -p /app
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn

COPY . .
RUN yarn build

EXPOSE 80
CMD [ "yarn", "start" ]
