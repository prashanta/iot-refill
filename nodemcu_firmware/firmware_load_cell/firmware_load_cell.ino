#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include "HX711.h"

String deviceId = "11";

HX711 scale(D2, D3);
long weight_1 = 0;
long weight_2 = 0;
long weight = 0;
long lastWeight = 0;
long weightOffset = 10;

const char* ssid = "Home";
const char* password =  "pass";
const char* mqttServer = "192.168.0.21";
const int mqttPort = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

void setupWiFi(){
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);
  Serial.print("Connecting to ");
  Serial.print(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(" .");
  }
  Serial.println("");
  Serial.println("Connected to the WiFi network");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnectBroker(){
  while (!client.connected())
  {
    Serial.print("Connecting to MQTT ...");
    String clientId = "IoTRefill-";
    clientId += String(random(0xffff), HEX);

    if (client.connect(clientId.c_str())){
      Serial.println("OK");
    }
    else
    {
      Serial.println("Failed, rc=");
      Serial.print(client.state());
      Serial.println("Attempting again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  scale.set_scale();
  scale.tare();
  scale.set_scale(824.6f); // Comment out this line for the first time
  setupWiFi();
  client.setServer(mqttServer, mqttPort);
}

void loop() {
  if (!client.connected()) {
    reconnectBroker();
  }
  client.loop();

  weight_1 = scale.get_units(10);
  delay(800);
  weight_2 = scale.get_units(10);

  if(abs(weight_1 - weight_2) < 100){
    weight = weight_2;

    if(abs(weight - lastWeight) > weightOffset){
      Serial.print("Weight: ");
      Serial.print(weight, 1);
      Serial.println(" grams");

      if(weight > 0){
        String msg = "{\"deviceId\":\"" + deviceId + "\",\"weight\":\"" + String(weight, DEC) + "\"}";
        char payload[60];
        msg.toCharArray(payload,60);
        client.publish("iot/weight", payload);
        digitalWrite(LED_BUILTIN, LOW);
        delay(500);
        digitalWrite(LED_BUILTIN, HIGH);

      }
      lastWeight = weight;
    }
  }
}
