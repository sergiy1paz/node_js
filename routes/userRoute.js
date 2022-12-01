import express from 'express';
import _ from 'lodash';
import users from '../data/users.json';
import mongoose from 'mongoose';
import MongoDbContext, { UserModel, DB_URL } from '../db/index.js';

let usersStorage = _.toArray(users);
const dbContext = new MongoDbContext(DB_URL);
dbContext.connect();

export const getUsersStorage = () => [...usersStorage];

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
    res.json(usersStorage);
})

userRouter.get(`/:id`, (req, res) => {
    const id = req.params.id;
    const user = _.find(usersStorage, user => user.id === id);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).send("Not found");
    }
})

// userRouter.post("/", (req, res) => {
//     const userRequest = req.body;
//     if (userRequest && userRequest.username && userRequest.email && userRequest.password) {
//         usersStorage.push({
//             ...userRequest,
//             id: (usersStorage.length + 1).toString()
//         });
//         return res.status(201).send("Created")
//     }
//     return res.status(403).send("Bad request")
// })

userRouter.post("/", (req, res) => {
    const userRequest = req.body;
    if (userRequest && userRequest.username && userRequest.email && userRequest.password) {
        const user = new UserModel({
            _id: mongoose.Types.ObjectId(),
            ...userRequest
        })

        return user.save()
                .then((u) => res.status(201).json(u))
                .catch((e) => res.status(500).json(e));

    }
    return res.status(403).send("Bad request")
})

export default userRouter;