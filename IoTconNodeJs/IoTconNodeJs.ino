const byte DATA_MAX_SIZE = 16;
char data[DATA_MAX_SIZE]; // guarda los datos recibidos

int led1 = 1;

int led_inicial = 7;

void setup() {
  // put your setup code here, to run once:

  Serial.begin(9600); // comienza la comunicacion con el serial, siempre se coloca

  pinMode(led_inicial, OUTPUT);
  digitalWrite(led_inicial, HIGH);
}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(led_inicial, led1);
  Serial.println("Hola");
  datosRecibidos();
  delay(200);
  if (!strcmp(data, "on")) {
    led1 = 1;
  } else if (!strcmp(data, "off")) {
    led1 = 0;
  } else {
    Serial.println("invalido");
  }
  /*
    if( !strcmp(data,"on") || !strcmp(data,"off")){
    if(!strcmp(data,"on")){
      led1 = 1;
    }else{
      led1 = 0;
    }
    }else{
    Serial.println("invalido");
    }*/
  Serial.println(led1);
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
  Serial.println("error: mensaje incompleto");
  Serial.println(data);
  memset(data, 32, sizeof(data));

}
