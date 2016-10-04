var pubsub = require('./client.js');

pubsub.connect('ws://localhost:8124', (session) => {

	session.pub('test', 'hello');
	
	session.sub('echo', (msg) => {
		console.log('> chn:echo', msg);
	});

});
