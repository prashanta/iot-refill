FROM resin/raspberry-pi-node:6-slim

WORKDIR /usr/src/app

COPY package.json package.json

RUN JOBS=MAX npm install --production --unsafe-perm && npm cache clean && rm -rf /tmp/*

COPY . ./

# RUN npm install

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
