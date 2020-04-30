var socket = require('socket.io-client')('http://localhost:5000'); // se convierte en un cliente conectado a websockets
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');


var socInput = null;

// WebSockets config

socket.on('connect', () => {
    console.log("connected to server on wsocket");

});

socket.on('disconnect', () => {
    console.log("desconnecting wsocket");
});

socket.on('led_inicial', (senal) => {
    socInput = JSON.parse(senal);
    escribirArduino();
});



// SerialPort config //

const nombrePuerto = "/dev/ttyACM0";

const port = new SerialPort(nombrePuerto, { baudRate: 9600, buffersize: 1024 });
const parser = port.pipe(new Readline({ delimiter: '\n' })); // permite recibir los datos como strings y los divide segun el delimitador

//Permite saber cuando el puerto serial se encuentra abierto  o disponible para transmitir

port.on('open', () => {
    console.log('Puerto Serial Activo');
});

var socOutput = {
    valor: ''
};

//Lectura en el serial

var acumulador = [];

// cuando hay un dato en buffer se activa la funcion y se envia por webSocket
parser.on('data', (data) => {

    acumulador.push(data);
    socOutput.valor = data.replace('\r', ''); // permite eliminar el char '\r'
    console.log(socOutput.valor);
    socket.emit("arduinoOutput", JSON.stringify(socOutput)); // envia la info en formato JSON por WebSocket
    port.flush(); // permite desechar datos no capturados por el computador
});

// Escritura en el serial

function escribirArduino() {

    if (socInput.disp === 'led_inicial') {
        const estado = socInput.estado+'-';
        console.log(estado);
        port.write(estado, (err) => {
            if (err) return console.log('Hubo error', err.message);
            console.log('menssage written');
        });
    }
}








function escribirSerial() {

}










