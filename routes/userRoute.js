import express from 'express';
import _ from 'lodash';
import users from '../data/users.json';

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
    res.json(users);
})

userRouter.get(`/:id`, (req, res) => {
    const id = req.params.id;
    const user = _.find(users, user => user.id === id);
    if (user) {
        res.json(user);
    } else {
        res.send("Not found");
    }
})

export default userRouter;