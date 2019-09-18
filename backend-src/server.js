const KoaStaticServer = require('koa-static-server');
const config = require('config');
const fs = require('fs');
const timestamp = require('time-stamp');

const { io, app, server } = require('./server_singleton');

const plots = config.get('plots');

// log file name
const logfile = `${timestamp('DD.MM.YYYY_HH:mm:ss')}.csv`;

const stream = fs.createWriteStream(`logs/${logfile}`, {flags: 'a+'});

stream.write(`# Hopper logfile created at: ${timestamp('DD.MM.YYYY HH:mm:ss')} \n`);

let header = `# Plots: `;

for(const plot of plots){
	header += `${plot.name}, `;
}

header = header.slice(0, -2);

header += `\n`;

stream.write(header);

app.use(KoaStaticServer({
	rootDir: 'build',
	index: 'index.html',
}));

io.on('connection', (socket) => {
	console.log('client connected');

	socket.on('getLog', () => {
		socket.emit('log', {
			name: logfile,
			data: fs.readFileSync(`logs/${logfile}`).toString(),
		});
	});

	socket.on('disconnect', () => {
		console.log('client disconnected');
	});

	socket.emit('setup', plots);
});

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
	let obj = [];

	try {
		obj = JSON.parse(chunk);
	} catch (e) {
		return;
	}

	const unixts = (new Date()).getTime();

	let line = '';

	line += `${unixts}, `;

	for(const datum of obj){
		line += `${datum}, `;
	}

	line = line.slice(0, -2);

	line += '\n';

	stream.write(line);

	io.emit('data', {
		data: obj,
		timestamp: unixts,
	});
});

console.log(plots);

server.listen(3001);
