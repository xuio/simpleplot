const KoaStaticServer = require('koa-static-server');
const config = require('config');

const { io, app, server } = require('./server_singleton');

const plots = config.get('plots');

app.use(KoaStaticServer({
	rootDir: 'build',
	index: 'index.html',
}));

io.on('connection', (socket) => {
	console.log('client connected');

	socket.on('action', (msg) => {
		console.log(msg);
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

	io.emit('data', obj);
});

console.log(plots);

server.listen(3001);
