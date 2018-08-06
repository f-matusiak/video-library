require('dotenv').config();
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const socketConfig = require('./socket.js');

const app = express();
const server = http.createServer(app);
const io = socketConfig(server);

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(logger('dev'));

const routes = require('./routes');
app.use('/', routes);

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    'errors': {
      message: err.message,
    }
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${server.address().port}.`);
});