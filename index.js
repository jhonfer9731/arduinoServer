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
const parser = port.pipe(new Readline({ delimiter: '-%-' })); // permite recibir los datos como strings y los divide segun el delimitador

//Permite saber cuando el puerto serial se encuentra abierto  o disponible para transmitir

port.on('open', () => {
    console.log('Puerto Serial Activo');
});

var socOutput = {
    valor: ''
};

//Lectura en el serial

var acumulador = [];

var arduino = {
    inputs : [],
    outputs: []
};

// cuando hay un dato en buffer se activa la funcion y se envia por webSocket
parser.on('data', (data) => {

    //acumulador.push(data);
    
    var ban_str = tratamientoSerial(data, '$VO1$');
    if (ban_str) arduino.outputs.push(ban_str);
    ban_str = tratamientoSerial(data, '$VI2$');
    if (ban_str) arduino.inputs.push(ban_str);
    //console.log(arduino);
    port.flush(); // permite desechar datos no capturados por el computador

    if (ban_str) {

        socket.emit("arduinoOutput", JSON.stringify(arduino)); // envia la info en formato JSON por WebSockeb

    }
    arduino.inputs = [];
    arduino.outputs = [];

});



// Escritura en el serial

function escribirArduino() {

    if (socInput.disp === 'led_inicial') {
        const estado = socInput.estado + '-';
        console.log(estado);
        port.write(estado, (err) => {
            if (err) return console.log('Hubo error', err.message);
            console.log('menssage written');
        });
    }
}



function tratamientoSerial(data, limiter) {

    data = data.replace('\r', ''); // permite eliminar el char '\r'
    var dataTemp = data.split(limiter)[1];
    //console.log(dataTemp);
    if ((dataTemp !== undefined) && (dataTemp !== null) ) {

        var InOut = {
            nombre : '',
            valor: parseFloat(dataTemp)
        };
        switch(limiter)
        {
            case '$VO1$':
                InOut.nombre = 'temp';
                break;
            case '$VI2$':
                InOut.nombre = 'led_ini';
                break;
        }
        return InOut;
    } else {
        return null;
    }
}









