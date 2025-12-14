const express = require('express');
const http = require('http');
const { Server } = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.use(express.static('public'));


// Simulasi 3 device
let devices = [
{ id: 1, name: 'Router-1', status: 'online', bandwidth: 0 },
{ id: 2, name: 'Switch-1', status: 'online', bandwidth: 0 },
{ id: 3, name: 'Server-1', status: 'online', bandwidth: 0 }
];


let logs = [];


// REST API data historis
app.get('/api/devices', (req, res) => {
res.json(devices);
});


// Simulasi update data setiap 2 detik
setInterval(() => {
devices.forEach(device => {
// Random online/offline
if (Math.random() < 0.1) {
device.status = device.status === 'online' ? 'offline' : 'online';
logs.push(`${new Date().toLocaleTimeString()} - ${device.name} ${device.status}`);
}


// Bandwidth simulasi
device.bandwidth = device.status === 'online'
? Math.floor(Math.random() * 100)
: 0;
});


io.emit('update', { devices, logs });
}, 2000);


io.on('connection', (socket) => {
console.log('Client connected');
socket.emit('update', { devices, logs });
});


server.listen(3000, () => {
console.log('Server running at http://localhost:3000');
});
