const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const Device = require('./device');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const devices = [
  new Device(1, 'Router-1'),
  new Device(2, 'Switch-1'),
  new Device(3, 'Server-1')
];

let logs = [];

// fungsi konversi ke object biasa
function serializeDevices() {
  return devices.map(d => ({
    id: d.id,
    name: d.name,
    status: d.status,
    bandwidth: d.bandwidth
  }));
}

// REST API
app.get('/api/devices', (req, res) => {
  res.json(serializeDevices());
});

// simulasi realtime
setInterval(() => {
  devices.forEach(device => {
    const prevStatus = device.status;
    device.update();

    if (prevStatus !== device.status) {
      logs.push(
        `${new Date().toLocaleTimeString()} - ${device.name} ${device.status}`
      );
    }
  });

  io.emit('update', {
    devices: serializeDevices(),
    logs
  });
}, 2000);

io.on('connection', socket => {
  socket.emit('update', {
    devices: serializeDevices(),
    logs
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
