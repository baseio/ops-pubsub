var WebSocket = require('ws');

module.exports.connect = (url, cb) => {
	var ws = new WebSocket(url);
	var subchn = {};

	var session = {
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

	ws.on('open', () => {
		cb( session );
	});

	ws.on('message', (data, flags) => {
		var msgchn = -1;
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
	});
}