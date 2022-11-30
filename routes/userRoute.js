import express from 'express';
import _ from 'lodash';
import users from '../data/users.json';

let usersStorage = _.toArray(users);

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
    res.json(usersStorage);
})

userRouter.get(`/:id`, (req, res) => {
    const id = req.params.id;
    const user = _.find(usersStorage, user => user.id === id);
    if (user) {
        res.json(user);
    } else {
        res.send("Not found");
    }
})

userRouter.post("/", (req, res) => {
    const userRequest = req.body;
    if (userRequest && userRequest.username && userRequest.email && userRequest.password) {
        usersStorage.push({
            ...userRequest,
            id: (usersStorage.length + 1).toString()
        });
        return res.send("201 Created")
    }
    return res.send("403 Bad request")
})

export default userRouter;