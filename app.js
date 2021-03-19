const express = require('express');
const os = require("os");

var mongo = require('mongodb'); 
var MongoClient = require('mongodb').MongoClient;

const mongoHost = process.env.database-host;
const mongoPort = process.env.database-port;
const mongoDatabase = process.env.database-name;
const mongoUser = process.env.database-user;
const mongoPassword = process.env.database-password;

var mongourl = "mongodb://" + mongoHost + ":" + mongoPort + "/" + mongoDatabase

const app = express();
const port = 8080;
const hostname = "0.0.0.0";

app.get('/', (req, res) => {
    output = "Bollocks";
    mongoConnect();
  
  res.send(output)
})

app.get('/healthz', (req, res) => {
  res.send('ok');
})

app.listen(port, hostname, () => {
  console.log(`MongoDB app listening at http://${hostname}:${port}`)
})

function mongoConnect() {
    MongoClient.connect(url, function (err, db) {
        if (err)
            throw err;
        console.log("Database " + mongoDatabase + " exists.");
        output = "Database " + mongoDatabase + " exists.";
        db.close();
    });
}
