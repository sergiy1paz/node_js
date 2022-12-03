import express from 'express';
import _ from 'lodash';
import users from '../data/users.json';
import mongoose from 'mongoose';
import MongoDbContext, { UserModel, DB_URL } from '../db/index.js';

let usersStorage = _.toArray(users);
const dbContext = new MongoDbContext(DB_URL);
dbContext.connect();

export const getLocalUsers = () => [...usersStorage];
export const getDbUsers = async () => await UserModel.find();

const userRouter = express.Router();

userRouter.get('/local', (req, res) => {
    res.json(usersStorage);
})

userRouter.get(`/local/:id`, (req, res) => {
    const id = req.params.id;
    const user = _.find(usersStorage, user => user.id === id);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).send("Not found");
    }
})

userRouter.post("/local/:id", (req, res) => {
    const userRequest = req.body;
    if (userRequest && userRequest.username && userRequest.email && userRequest.password) {
        usersStorage.push({
            ...userRequest,
            id: (usersStorage.length + 1).toString()
        });
        return res.status(201).send("Created")
    }
    return res.status(403).send("Bad request")
})

// db crud

userRouter.get("/db/", async (req, res) => {
    const users = await UserModel.find();
    res.status(200).send(users);
})

userRouter.get("/db/:id", async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(403).json({ error: "Id is not valid" })
    }

    const user = await UserModel.findById(id);

    if (user) {
        return res.status(200).json(user);
    }

    return res.status(404).send("Not found");
})


userRouter.post("/db/", (req, res) => {
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

userRouter.delete("/db/:id", (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(403).json({ error: "Id is not valid" })
    }
    return UserModel.deleteOne({ _id: mongoose.Types.ObjectId(id) })
        .then(() => res.sendStatus(204))
        .catch((e) => res.status(500).send(e));
})

userRouter.patch("/db/:id", async (req, res) => {
    const id = req.params.id;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || _.isEmpty(updates)) {
        return res.status(403).json({ error: "Input data is not valid" })
    }

    const userObjectId = mongoose.Types.ObjectId(id);


    await UserModel.updateOne(
        {
            _id: userObjectId
        },
        {
            ...(updates.username ? { username: updates.username } : {}),
            ...(updates.email ? { email: updates.email } : {}),
            ...(updates.password ? { password: updates.password } : {}),
            ...(updates.ip_address ? { ip_address: updates.ip_address } : {})
        });

    const updatedUser = await UserModel.findOne({ _id: userObjectId });
    if (updatedUser) {
        return res.status(200).json(updatedUser);
    }
    return res.sendStatus(404);
})

export default userRouter;