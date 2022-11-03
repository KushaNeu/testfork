const express = require('express')
const app = express();

const hostname = '127.0.0.1';
const port = 3050


app.get('/healthz', (req, res) => {
    //console.log('Health Check Request');
    res.removeHeader('X-Powered-By');
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).end();
});

app.listen(port);
//console.log(`Api Server running on ${hostname}:${port} `);