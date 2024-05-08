const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let directionValue = "centro"; // Valor inicial

// Endpoint para servir la página por defecto
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Endpoint para servir la página de salida
app.get('/salida', (req, res) => {
    res.sendFile(__dirname + '/salida.html');
});

// Endpoint para obtener el valor 
app.get('/getDirectionValue', (req, res) => {
    res.json({ value: directionValue });
});

// Endpoint para actualizar el valor 
app.post('/setDirectionValue/:value', (req, res) => {
    directionValue = req.params.value;
    // Emitir el nuevo valor a todos los clientes conectados
    io.emit('directionValueUpdated', directionValue);
    res.json({ success: true });
});

// Escuchar conexiones de clientes WebSocket
io.on('connection', (socket) => {
    // Emitir el valor inicial al cliente recién conectado
    socket.emit('directionValueUpdated', directionValue);
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
