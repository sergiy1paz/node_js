import express from 'express';
import userRouter, { getUsersStorage } from './routes/userRoute.js';
import _ from 'lodash';
import morgan from 'morgan';
import morganBody from 'morgan-body';
import bodyParser from 'body-parser';
import path from 'path';

const SERVER_PORT = 3001;
const USERS_URL = '/api/v1/users';

const server = express();

// middleware
//server.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
server.use(bodyParser.json());
morganBody(server);

server.set('views', path.join('views'));
server.set('view engine', 'ejs');

server.use(USERS_URL, userRouter);
// middleware

// default routes
server.get('/', (req, res) => {
    console.log("Hello from root");
    res.send("Hello browser!");
})

server.get('/show', (req, res) => {
    res.render('index', { users: getUsersStorage() })
})

server.listen(SERVER_PORT, () => {
    console.log(`Server listen on port ${SERVER_PORT}`)
})
// default routes
