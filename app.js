const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });

let clients = [];
app.use(bodyParser.json());
app.use(express.static('public'))

wss.on('connection', (ws) => {
    clients.push(ws);

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
    });
});

app.get('/control/:item/:action', async (req, res) => {
    console.log(req.params.item, req.params.action);

    if (clients.length === 0) {
        res.send({ code: 500, err: 'Disconnected', response: 'No clients connected'});
        return;
    }
    const messages = clients.map(client => {
        return new Promise((resolve, reject) => {

            if (client.readyState === WebSocket.OPEN) {
                client.send("{item: '" + req.params.item + "', action: '" + req.params.action + "'}");
                client.on('message', (msg) => {
                    console.log(msg.toString())
                    resolve(msg.toString());
                });
            } else {
                reject("Error. Client not connected");
            }
        });
    });
    try {
        const responses = await Promise.all(messages);
        res.send({ code: 200, response: responses[0] });
    } catch (err) {
        res.send({ code: 500, err });
    }
});

app.get('/', function (req, res) {
    res.sendFile('views/index.html', { root: __dirname })
});

server.listen(8080, () => {
    console.log('Server started on port 8080');
});