## IoT Replenish Application

This is an IoT application comprising of Raspberry Pi and ESP-8266, which adds items that are in running low  to a "Shopping List" on iOS Reminder application.

ESP-8266 are either deployed as switch or weight sensor. When the switch is pressed or weight changes, it sends a MQTT message to a broker running on Raspberry Pi. RPi is also running a node.js application that is acting like a MQTT client and receives all MQTT messages. It examins the message and determines whether the item needs to be added to shipping list.

The R. Pi is running a Node.js application and MQTT broker. This entire setup is deployed using Balena Cloud, as docker multi-container package.


![](https://raw.githubusercontent.com/prashanta/iot-refill/master/node/public/images/sys.png)
