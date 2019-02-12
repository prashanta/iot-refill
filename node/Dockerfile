FROM resin/raspberry-pi-node:6-slim

WORKDIR /usr/src/app

COPY package.json package.json

RUN JOBS=MAX npm install --production --unsafe-perm && npm cache clean && rm -rf /tmp/*

# This will copy all files in our root to the working  directory in the container
COPY . ./

# server.js will run when container starts up on the device
CMD ["npm", "start"]
