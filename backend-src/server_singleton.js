const Koa = require('koa');
const http = require('http');

const socketio = require('socket.io');

const App = new Koa();

const Server = http.createServer(App.callback());

const Io = socketio(Server);

module.exports = {
	app: App,
	io: Io,
	server: Server,
};
