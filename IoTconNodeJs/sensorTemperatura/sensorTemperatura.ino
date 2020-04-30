const int inputPin = A3;
int raw = 0;

double voltaje = 0;
double temp = 0;

void setup() {
  // put your setup code here, to run once:
  pinMode(inputPin,INPUT);  
  Serial.begin(9600);
  

}

void loop() {
  // put your main code here, to run repeatedly:
  raw = analogRead(inputPin);
  voltaje = (raw/1023.0)*5000; // en milivoltios
  temp = voltaje*0.1;

  Serial.print("Voltaje= ");
  Serial.print(voltaje);
  Serial.print("\t Temperatura= ");
  Serial.println(temp);
  delay(500);
}
