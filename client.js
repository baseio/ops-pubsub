var ReconnectingWebSocket = require('rws').ReconnectingWebSocket;

module.exports.connect = (url, clientId, cb) => {

	clientId = clientId || 'client-'+ Math.ceil(Math.random()*100);

	var ws = new ReconnectingWebSocket(url, {id:clientId});
	var subchn = {};

	var session = {
		id: clientId,
		pub: (chn, msg) => {
			var pack = JSON.stringify({chn:chn, msg:msg});
			ws.send( pack );
		},
		sub: (chn, cb) => {
			console.log('# sub', chn);
			ws._x_channel = chn;
			subchn[chn] = cb;
		}
	};

	ws.onopen = () => {
		console.log('connection open');
		cb( session );
	};

	ws.onclose = () => {
		console.log('connection closed');
	};

	ws.onerror = (err) => {
		console.log('connection error', err);
	};

	ws.onmessage = (event) => {
		var msgchn = -1;
		var data = event.data;
		if( subchn[ws._x_channel] ){
			try {
				var json = JSON.parse(data);
				msgchn = json.chn || json.channel;
			}catch(e){}

			if( msgchn !== -1 && msgchn === ws._x_channel){
				subchn[ws._x_channel](json.msg);
			}else{
				console.log('# hush: (', data, '). We listen to ', Object.keys(subchn) );
			}				
		}
	};
}