import express from 'express';

const SERVER_PORT = 3001;

const server = express();

server.get('/', (req, res) => {
    console.log("Hello from root");
    res.send("Hello browser!");
})

server.listen(SERVER_PORT, () => {
    console.log(`Server listen on port ${SERVER_PORT}`)
})
