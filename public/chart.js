const socket = io();


const ctx = document.getElementById('bandwidthChart');
const chart = new Chart(ctx, {
type: 'line',
data: {
labels: [],
datasets: [
{ label: 'Router-1', data: [] },
{ label: 'Switch-1', data: [] },
{ label: 'Server-1', data: [] }
]
}
});


socket.on('update', data => {
const table = document.getElementById('deviceTable');
table.innerHTML = '';


data.devices.forEach((d, i) => {
table.innerHTML += `<tr>
<td>${d.name}</td>
<td class="${d.status}">${d.status}</td>
<td>${d.bandwidth} Mbps</td>
</tr>`;


chart.data.datasets[i].data.push(d.bandwidth);
});


chart.data.labels.push(new Date().toLocaleTimeString());
if (chart.data.labels.length > 10) {
chart.data.labels.shift();
chart.data.datasets.forEach(ds => ds.data.shift());
}
chart.update();


document.getElementById('log').innerHTML = data.logs.slice(-5).join('<br>');
});
