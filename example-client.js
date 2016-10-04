var pubsub = require('./client.js');


// signature: pubsub.connect(addr, client-id, callback)
pubsub.connect('ws://localhost:8124', 'example-client', (session) => {

	// publish a message to a channel. Signature: pub(channel, message)
	session.pub('test', 'hello');

	// subscribe to a channel. Signature: sub(channel, cb)
	session.sub('echo', (msg) => {
		console.log('> chn:echo', msg);
	});

	// demo - send sth periodically
	setInterval(function () {
	  session.pub('test', 'Hello from ' + session.id +  ' ' + new Date().toISOString());
	}, 5000);
});
