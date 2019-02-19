/*
A module that provides MQTT functionalities.
*/

var mqtt    = require('mqtt');
var request = require('request');
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');


mqttutil = function(){

    // The MQTT Client
    this.mqttClient = "";

    // MQTT Broker url
    this.url = "mqtt://mqtt";

    // IFTTT URL
    this.ifttt = "https://maker.ifttt.com/trigger/addtask/with/key/" + process.env.ifttt;

    // Setup MQTT Client - connect to broker and subscribe to topics
    this.setup= function(){
        var _this = this;
        _this.mqttClient  = mqtt.connect(this.url, {connectTimeout: 10*1000});
        _this.mqttClient.on('error', function () {
            console.log("No connection to  broker at " + _this.url);
        });
        _this.mqttClient.on('connect', function(){
            _this.mqttClient.subscribe('iot/switch');
            _this.mqttClient.subscribe('iot/weight');
        });
        _this.mqttClient.on('message', _this.onReceiveMessage);
    };

    this.onReceiveMessage =  function(topic, message){
        // Parse string to json
        var msg = JSON.parse(message);
        console.log("Topic: " + topic);
        console.log("Received mqtt message: ");
        console.log(msg);

        if(topic == "iot/switch")
            this.handleSwitch(msg);
        else if(topic == "iot/weight")
            this.handleWeight(msg);
    }.bind(this);

    this.handleSwitch = function(msg){
        var adapter = new FileSync('db.json');
        var db = low(adapter);
        var result = null;
        if(msg.trigger == 1){
            result = db.get("devices").find({deviceId : msg.deviceId}).value();
            if(result != null){
                value = result.itemName;
                console.log("Sending request to IFTTT");
                request.post(this.ifttt, {form:{value1:value}});
            }
        }
    };

    this.handleWeight = function(msg){
        var adapter = new FileSync('db.json');
        var db = low(adapter);
        var result = null;
        result = db.get("devices").find({deviceId : msg.deviceId}).value();
        if(result != null){
            if(parseInt(msg.weight) < parseInt(result.refillSetpoint)){
                value = result.itemName;
                console.log("Sending request to IFTTT");
                request.post(this.ifttt, {form:{value1:value}});
            }
        }
    };
};

module.exports = new mqttutil();
