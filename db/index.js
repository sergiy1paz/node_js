import mongoose from 'mongoose';

export const DB_URL = `mongodb://localhost:27017/nodejs22`;

export function connect() {
    mongoose.connect(DB_URL);
    
}

export function getDbConnection() {
    return mongoose.connection;
}

export default class MongoDbContext {
    #url;

    constructor(url) {
        this.#url = url;
    }

    connect() {
        mongoose.connect(this.#url);
        this.db.once('open', () => {
            console.log("Db connection is established");
        })
    }

    get db() {
        return mongoose.connection;
    }
}

export const UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    email: String,
    password: String,
    ip_address: String
});

export const UserModel = mongoose.model("User", UserSchema);
