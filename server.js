var cfg = {
	port: 8124,
	debug: 10
}

var pack  = require('./package.json');
var chalk = require('chalk');
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: cfg.port });
console.log('Starting '+pack.name, 'version '+ pack.version, 'on port '+ cfg.port);

function printableId(sock){
	return sock.upgradeReq.headers['sec-websocket-key'] +'@'+ sock.upgradeReq.connection.remoteAddress +':'+ sock.upgradeReq.connection.remotePort;
}


wss.on('connection', function(ws) {
	var id = ws.upgradeReq.headers['sec-websocket-key'];
	if( cfg.debug > 1 ){
		console.log( chalk.grey('+ Added client'), printableId(ws), chalk.grey('Connections:'), wss.clients.length);
	}
	
	ws.on('message', function(msg) {
		console.log('>', wss.clients.length, id, msg);

		if( wss.clients.length <= 1) return;

		console.log( chalk.grey('☰ Broadcasting message from client'), 
			printableId(ws),
			chalk.grey('to'), (wss.clients.length-1), chalk.grey('(other) clients. Message:'),
			chalk.yellow(msg)
		);

		wss.clients.map( (client) => {
			var clientId = client.upgradeReq.headers['sec-websocket-key'];
			
			// send to all clients, except ourselves
			if( clientId !== id ){

				// socket is open, send should be safe
				if( client.readyState === 1 ){
					client.send( msg, (err) => {
						if( err ){
							console.log( chalk.red('501 Send error:'), err);
						}else{
							if( cfg.debug > 2 ){
								console.log( chalk.green('  ✓'), chalk.grey('Ack:'), printableId(client) );
							}
						}
					});
				
				}else{
					// socket is not **confirmed** open, lets try
					try {
						client.send( msg, (err) => {
							if( err ){
								console.log( chalk.red('502 Send error:'), err);
							}
						});		
					}catch(err){
						console.log( chalk.red('503 Send error:'), err);
					}
				}

			}
		});

	});
});