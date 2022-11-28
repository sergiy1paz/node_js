import express from 'express';
import users from './data/users.json';
import _ from 'lodash';

const SERVER_PORT = 3001;
const USERS_URL = '/api/v1/users';

const server = express();

server.get('/', (req, res) => {
    console.log("Hello from root");
    res.send("Hello browser!");
})

// users
server.get(USERS_URL, (req, res) => {
    res.json(users);
})

server.get(`${USERS_URL}/:id`, (req, res) => {
    const id = req.params.id;
    const user = _.find(users, user => user.id === id);
    if (user) {
        res.json(user);
    } else {
        res.send("Not found");
    }
})

server.listen(SERVER_PORT, () => {
    console.log(`Server listen on port ${SERVER_PORT}`)
})
