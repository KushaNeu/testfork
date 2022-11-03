require('rootpath')();
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const basicAuth = require('_middleware/basic-auth');
const errorHandler = require('_middleware/error-handler');
require('dotenv').config();
const env = process.env;

app.use(fileUpload({
    createParentPath: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use basic HTTP auth to secure the api
//app.use(basicAuth);

// api routes
app.use('/v1', require('./users/users.controller'));
app.use('/v1', require('./document/document-controller'));
app.get("/healthz", (req, res) => {
    res.status(200).send({"statusCode":200, "message":"healthCheck successful!!!"});
});

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));