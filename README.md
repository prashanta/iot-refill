## IoT Replenish Application

This is an IoT project comprising of Raspberry Pi as a gateway and NodeMCUs as event devices. The objective of this project is to add items that are running low to a "Shopping List" on iOS Reminder application.

NodeMCUs are either deployed with either with a switch or load cell. When the switch is pressed or weight changes, it sends a MQTT message to MQTT broker running on Raspberry Pi. Each event device represents item that can be added to shopping list.

Raspberry Pi is running a Node.js application and MQTT broker (Mosquitto). The node.js application comprises of web applcation (for provisioning event devices) and a MQTT client that listens to MQTT messages. It examins MQTT payloads and determines if item needs to be added to shopping list. Both the Node.js application and MQTT broker are runnning in their respective docker containers and run as multi-container docker application on Raspberry Pi. [Balena Cloud](https://www.balena.io/cloud) has been used to deploy the multi-container docker application to Raspberry Pi.


![](https://raw.githubusercontent.com/prashanta/iot-refill/master/node/public/images/sys.png)
