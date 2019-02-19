#include <ESP8266WiFi.h>
#include <PubSubClient.h>

String deviceId = "10";

int ledState = HIGH;
int buttonState = HIGH;
int lastButtonState = HIGH;   // the previous reading from the input pin

unsigned long lastDebounceTime = 0;  // the last time the output pin was toggled
unsigned long debounceDelay = 50;    // the debounce time; increase if the output flickers

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

  pinMode(D1, INPUT);

  Serial.begin(115200);
  setupWiFi();
  client.setServer(mqttServer, mqttPort);
}

void loop() {
  if (!client.connected()) {
    reconnectBroker();
  }
  client.loop();
  int reading = digitalRead(D1);

  // If the switch changed, due to noise or pressing:
  if (reading != lastButtonState) {
    // reset the debouncing timer
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {
    // whatever the reading is at, it's been there for longer than the debounce
    // delay, so take it as the actual current state:

    // if the button state has changed:
    if (reading != buttonState) {
      buttonState = reading;

      // send MQTT packed when state is HIGH
      if (buttonState == HIGH) {
        String msg = "{\"deviceId\":\"" + deviceId + "\",\"trigger\":\"1\"}";
        char payload[60];
        msg.toCharArray(payload,60);
        client.publish("iot/switch", payload);
      }
    }
  }

  // set the LED:
  digitalWrite(LED_BUILTIN, buttonState);

  // save the reading. Next time through the loop, it'll be the lastButtonState:
  lastButtonState = reading;
}
