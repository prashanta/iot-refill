# IoT Replenish Application

This is an IoT project comprising of Raspberry Pi as a gateway and NodeMCUs as agent devices to log events. Objective of this project is to add items that are running low to a "Shopping List" in iOS Reminder application.

NodeMCUs are deployed either with a switch or load cell. When switch is pressed or weight changes, it sends a MQTT message to broker running on Raspberry Pi. Each agent device represents an item that can be added to shopping list.

Raspberry Pi is running a Node.js application along with a MQTT broker ([Mosquitto](https://mosquitto.org)). Node.js application comprises of web application (for provisioning event devices) and MQTT client that subscribes to topics from agent devices. It examines MQTT payloads and determines if an item needs to be added to shopping list. Both Node.js application and MQTT broker are running in their respective docker containers and entire project is run as multi-container docker application on Raspberry Pi. [Balena Cloud](https://www.balena.io/cloud) has been used to deploy the multi-container docker application to Raspberry Pi.

<p align="center">
  <img src="https://raw.githubusercontent.com/prashanta/iot-refill/master/node/public/images/sys.png">
</p>

<p align="center">
  <img width="450px" height="450px" src="https://raw.githubusercontent.com/prashanta/iot-refill/master/node/public/images/setup.png">
</p>

## How to Run?

This project uses multi-docker container it can be run on Raspberry Pi as well as on desktop. Prerequisite is that git and docker have to be installed on Raspberry Pi (or desktop).

### Running on Raspberry Pi

1. Download source code on Raspberry Pi

```
git clone https://github.com/prashanta/iot-refill.git
cd iot-refill
```

2. Rename `docker-compose.yml.rpi` file to `docker-compose.yml`

3. Create IFTTT applet to send events to iOS Reminder using [WebHooks](https://ifttt.com/maker_webhooks)

4. Copy token at end of WebHook URL from [IFTTT Setting](https://ifttt.com/services/maker_webhooks/settings)

5. Edit file `node\Dockerfile` to replace 'insert_key_here' with the IFTTT token, to setup environment variable for the container

6. Run application

```
docker-compose up
```

The same result can be achieved using Balena Cloud, without the hassle of setting up git and docker on Raspberry Pi (follow instruction [here](https://www.balena.io/docs/learn/getting-started/raspberrypi3/nodejs/)).

### Running on Desktop

1. Download source code on desktop

```
git clone https://github.com/prashanta/iot-refill.git
cd iot-refill
```

2. Rename `docker-compose.yml.dev` file to `docker-compose.yml`

3. Create IFTTT applet to send events to iOS Reminder using [WebHooks](https://ifttt.com/maker_webhooks)

4. Copy token at end of WebHook URL from [IFTTT Setting](https://ifttt.com/services/maker_webhooks/settings)

5. Edit file `docker-compose.yml` to replace `insert_key_here` with the IFTTT token, to setup environment variable for the container

6. Run application

```
docker-compose up
```

## Adding Agent Device to Gateway

Once the application is running follow these steps:

1. Open application web interface using browser (http://ip_address_of_raspberrypi)

2. Click 'Add Device' to add either a switch or weight based device.

<p align="center">
  <img src="https://raw.githubusercontent.com/prashanta/iot-refill/master/node/public/images/add_device_switch.png">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/prashanta/iot-refill/master/node/public/images/add_device_weight.png">
</p>

## Deploying Agent Devices

The firmware for NodeMCU are located in `nodemcu_firmware` folder. The folder contains two firmwares for weight and switch based agent devices. Project can be tested without NodeMCU hardware, by using a MQTT Client (like [MQTT.fx](https://mqttfx.jensd.de)) to mimic MQTT message from agent devices.

Once the desktop MQTT Client is connected to the broker on Raspberry Pi, send the following MQTT packets to mimic the NodeMCU device:

1. For switch based agent device send:
```
Topic: iot/switch
Message: {"deviceId":"10", "trigger":"1"}
```

2. For weight based agent device send:
```
Topic: iot/weight
Message: {"deviceId":"11", "weight":"90"}
```

Once these messages are received by Raspberry Pi, it will send out IFTTT web request to add respective items to shopping list on iOS Reminders application.

## Demo

<p align="center">
  <img src="https://raw.githubusercontent.com/prashanta/iot-refill/master/node/public/images/demo.gif">
</p>

For HD video click [here](https://raw.githubusercontent.com/prashanta/iot-refill/master/node/public/images/demo.mov)
