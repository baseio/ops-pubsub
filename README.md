# ops-pubsub

A websocket server that broadcasts messages from any client to all other clients

### TODO

- Limit access (to a known list of clients)
- TLS (we intend to use this "behind" our other servers (where TLS is already terminated), but maybe add it as a conf option)
- Allow setting $port via .env

- Keep track of what we have sent to each client, so we can re-send if they come online again. Or should we?
- async log (persistent?)
- 
 