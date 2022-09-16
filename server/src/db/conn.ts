import { AnyError, Db, MongoClient } from "mongodb";
const client = new MongoClient(process.env.MONGO_URL!);
let dbConnection: Db;

export function connectToServer(callback: (err?: AnyError) => void) {
  client.connect(function (err, db) {
    if (err || !db) {
      return callback(err);
    }

    dbConnection = db.db("sample_airbnb");
    console.log("Successfully connected to MongoDB.");

    return callback();
  });
}

export function getDb() {
  return dbConnection;
}
