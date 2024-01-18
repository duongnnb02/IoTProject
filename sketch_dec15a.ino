#define BLYNK_PRINT Serial
#define BLYNK_TEMPLATE_ID "TMPL6MqQeq5_I"
#define BLYNK_TEMPLATE_NAME "EMeasurement"
#define BLYNK_AUTH_TOKEN "gjcvzX_FzjQk4bGGeL2T6nIiqWTLzgis"
#define Relay D1

#include <PZEM004Tv30.h>
#include <ESP8266WiFi.h>
#include <BlynkSimpleEsp8266.h>
//Import thêm 2 thư viện này
#include <ArduinoJson.h>
#include <PubSubClient.h>

PZEM004Tv30 pzem(D4, D3);
//code
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE (50)
char msg[MSG_BUFFER_SIZE];

int value = 0;
//
char ssid[] = "5h30AM";
char pass[] = "123456789";

int U = 0;
float I = 0.0;
int P = 0;
float W = 0.0;
int F = 0;
float PF = 0.0;
int status;
String SDT1="0868158702";  


void guitinnhan(String sdtnhan,String noidung)
{ 
  Serial.print("AT+CMGS=\"");delay(200);
  Serial.print(sdtnhan) ;delay(200);
  Serial.println("\"")  ;delay(200);
  Serial.print(noidung) ;delay(200);
  Serial.write(26)      ;delay(200);     // Kết thúc lênh gửi
 
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Connected, IP address: ");
  Serial.println(WiFi.localIP());
  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass);
  Blynk.virtualWrite(V0, 1);

  //set thêm server
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  //caichanrelay
  pinMode(5, OUTPUT);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  delay(1000);
  unsigned long now = millis();
  if (now - lastMsg > 5000) {
    lastMsg = now;
    ++value;
    
    float pzemU = pzem.voltage();
    float pzemI = pzem.current();
    int pzemP = pzem.power();
    float pzemW = pzem.energy()*3600;
    int pzemF = pzem.frequency();
    int pzemPF = pzem.pf();

    if (pzemP> 100) status =0;//0 la hong
    else status=1;//1 la binh thuong
    
    if (pzemP>100) {
      digitalWrite (Relay,LOW);//kichmucthap 
      delay(10000);
    }
    
    else digitalWrite (Relay,HIGH);
    if( pzemP >100 ) 
    { guitinnhan(SDT1,"Thiet Bi Hong !!!");  }

    DynamicJsonDocument doc(1024);
    doc["device_id"]="Device dht22";
    doc["U"]=pzemU;
    doc["I"]=pzemI;
    doc["P"]=pzemP;
    doc["W"]=pzemW;
    doc["F"]=pzemF;
    doc["PF"]=pzemPF;
    doc["status"]=status;
    
    Serial.println("Hoat dong binh thuong");
    char mqtt_message[128];
    serializeJson(doc,mqtt_message);
    publishMessage("esp8266/dht11", mqtt_message, true);
  }


  // put your main code here, to run repeatedly:
  readPzem();
  sendUpBlynk();
  delay(1000);
}

void readPzem()
{
  int pzemU = pzem.voltage();
  if (pzemU < 0 || isnan(pzemU) ) {
    pzemU = 0;
  }
  U = pzemU;

  float pzemI = pzem.current();
  if (pzemI < 0 || isnan(pzemI) ) {
    pzemI = 0;
  }
  I = pzemI;

  int pzemP = pzem.power();
  if (pzemP < 0 || isnan(pzemP) ) {
    pzemP = 0;
  }
  P = pzemP;

  int pzemW = pzem.energy();
  if (pzemW < 0 || isnan(pzemW) ) {
    pzemW = 0;
  }
  W = pzemW;

  int pzemF = pzem.frequency();
  if (pzemF < 0 || isnan(pzemF) ) {
    pzemF = 0;
  }
  F = pzemF;

  int pzemPF = pzem.pf();
  if (pzemPF < 0 || isnan(pzemPF) ) {
    pzemPF = 0;
  }
  PF = pzemPF;
}

void sendUpBlynk()
{
  Blynk.run();
  Blynk.virtualWrite(V1, U);
  Blynk.virtualWrite(V2, I);
  Blynk.virtualWrite(V3, P);
  Blynk.virtualWrite(V4, W);
  Blynk.virtualWrite(V5, F);
  Blynk.virtualWrite(V6, PF);
}

//COnnect
void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientID = "ESP8266Client-";
    clientID += String(random(0xffff), HEX);

    // Attempt to connect
    if (client.connect(clientID.c_str())) {
      Serial.println("Connected");
      client.subscribe("iot_collect");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  
  String msg = "";
  for (int i = 0; i < length; i++) {
    msg+=((char)payload[i]);
  }
  Serial.println("Message arived ["+String(topic)+"]"+msg); 
}

void publishMessage(const char* topic, String payload, boolean retained){
  if(client.publish(topic,payload.c_str(),true))
    Serial.println("Message published ["+String(topic)+"]: "+payload);
}
