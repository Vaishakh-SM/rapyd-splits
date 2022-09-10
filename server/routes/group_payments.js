const express = require("express");

const request = require("superagent");

// reference : https://github.com/mongodb-developer/mongodb-express-rest-api-example/blob/main/server/routes/record.js

const gpRoutes = express.Router();

// for connecting to database
const dbo = require("../db/conn");

gpRoutes.route("/api").get(function (req, res) {
  res.status(200).send("Lmaoded it works");
});

//localhost:27017// sample route for connecting to db
mongodb: gpRoutes.route("/api/getStuff").get(async function (_req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection("xyz")
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching stuff!");
      } else {
        res.json(result);
      }
    });
});

// making group api payment api call
gpRoutes.route("/api/makeGroupPayment").post(function (req, res) {
  const response = request.get("/url_here").then((res) => {});

  const response2 = request
    .post("/url_here")
    .send({ key: "value", key2: "value2" })
    .then((res) => {});
});

module.exports = gpRoutes;
