/* eslint-disable no-await-in-loop */
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import mongoose from 'mongoose';
import socketio from 'socket.io';
import http from 'http';
import apiRouter from './router';

// DB Setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/stocktracker';
mongoose.connect(mongoURI);
// set mongoose promises to es6 default
mongoose.Promise = global.Promise;

// initialize
const app = express();

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan('dev'));

// enable only if you want templating
app.set('view engine', 'ejs');

// enable only if you want static assets from folder static
app.use(express.static('static'));

// this just allows us to render ejs from the ../app/views directory
app.set('views', path.join(__dirname, '../src/views'));

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// additional init stuff should go before hitting the routing

// default index route
app.get('/', (req, res) => {
  res.send('hello world!');
});

app.use('/api', apiRouter);

// START THE SERVER
// =============================================================================

const port = process.env.PORT || 9090;
const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: '*', // allows requests all incoming connections
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});
server.listen(port);
const game = require('./game');

io.sockets.on('connection', (socket) => {
  console.log('connected to game');
  game.initGame(io, socket);
});

console.log(`listening on: ${port}`);
