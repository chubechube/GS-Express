FROM resin/raspberrypi3-node
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./package.json /usr/src/app/
COPY . /app /usr/src/app/
RUN npm install -gs

EXPOSE 8081
CMD [ "npm", "start" ]
