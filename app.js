import express from 'express';
import userRouter from './routes/userRoute.js';
import _ from 'lodash';
import morgan from 'morgan';

const SERVER_PORT = 3001;
const USERS_URL = '/api/v1/users';

const server = express();

server.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
server.use(USERS_URL, userRouter);

server.get('/', (req, res) => {
    console.log("Hello from root");
    res.send("Hello browser!");
})

server.listen(SERVER_PORT, () => {
    console.log(`Server listen on port ${SERVER_PORT}`)
})
