const byte DATA_MAX_SIZE = 16;
char data[DATA_MAX_SIZE]; // guarda los datos recibidos
const int analogPort = A3;
double voltaje = 0;
double temp = 0;

int ledSw = 1;

int led_inicial = 7;

void setup() {
  // put your setup code here, to run once:

  Serial.begin(9600); // comienza la comunicacion con el serial, siempre se coloca
  pinMode(led_inicial, OUTPUT);
  digitalWrite(led_inicial, HIGH);
}

void loop() {
  digitalWrite(led_inicial, ledSw);
  voltaje= analogRead(analogPort)*(1024/1023.0)*5000.0/1023.0;
  temp = voltaje*0.1;
  //Serial.println("Hola");
  datosRecibidos();
  delay(2000);
  Serial.print("$VO1$");
  Serial.print(temp);
  Serial.print("$VO1$");
  if (!strcmp(data, "on")) {
    ledSw = 1;
  } else if (!strcmp(data, "off")) {
    ledSw = 0;
  } else {
    //Serial.println("invalido");
  }
  Serial.print("-%-$VI2$");
  Serial.print(ledSw);
  Serial.println("$VI2$");
}


void datosRecibidos() {

  static char delimitador = '-';
  char charRecibido;
  int index = 0;

  memset(data, 32, sizeof(data)); // limpia el buffer

  while (Serial.available() > 0) {

    charRecibido = Serial.read();

    if (charRecibido == delimitador)
    {
      data[index] = '\0'; // Se finaliza el dato
      return; // retorna la funcion esta es la unica salida para que
      //la operacion sea exitosa
    }

    data[index] = charRecibido;
    index++;
    if ( index >= DATA_MAX_SIZE) {
      break;
    }
  }
  // si llega a este punto significa que se paso
  //Serial.println("error: mensaje incompleto");
  //Serial.println(data);
  memset(data, 32, sizeof(data));

}
