// device.js
class Device {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.status = 'online';
    this.bandwidth = 0;
  }

  update() {
    // simulasi online/offline
    if (Math.random() < 0.1) {
      this.status = this.status === 'online' ? 'offline' : 'online';
    }

    // simulasi bandwidth
    this.bandwidth = this.status === 'online'
      ? Math.floor(Math.random() * 100)
      : 0;
  }
}

module.exports = Device;
