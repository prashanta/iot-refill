/*
A module that provides MQTT functionalities.
*/

var mqtt    = require('mqtt');
var request = require('request');
var ifttt = require('./ifttt.js');
var db = require('./mongoutil.js');

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
        if(topic == "iot/switch")
            this.handleSwitch(msg);
        else if(topic == "iot/weight")
            this.handleWeight(msg);
    }.bind(this);

    this.handleSwitch = function(msg){
        if(msg.trigger == 1){
            // Get device information
            var dbo = new db();
            dbo.connect()
            .then(function(){
                return dbo.getDevice(msg.deviceId);
            })
            .then(
                function(result){
                    // Close database
                    dbo.close();
                    if(result.length > 0){
                        value = result[0].deviceName;
                        request.post(ifttt, {form:{value1:value}});
                    }
                }.bind(this)
            )
            .catch(function(err){
                dbo.close();
                console.log(err);
            });
        }
    }.bind(this);

    this.handleWeight = function(msg){
        var dbo = new db();
        dbo.connect()
        .then(function(){
            return dbo.getDevice(msg.deviceId);
        })
        .then(
            function(result){
                // Close database
                dbo.close();
                if(result.length > 0){
                    value = result[0].deviceName;
                    if(msg.weight < result[0].refillSetpoint){
                        request.post(ifttt, {form:{value1:value}});
                    }
                }
            }.bind(this)
        )
        .catch(function(err){
            dbo.close();
            console.log(err);
        });
    }.bind(this);
};

module.exports = new mqttutil();
