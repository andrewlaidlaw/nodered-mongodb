const express = require('express');
const os = require("os");

var mongo = require('mongodb'); 
var MongoClient = require('mongodb').MongoClient;

// Collect database settings
const mongoHost = process.env.database_host;
const mongoPort = process.env.database_port;
const mongoDatabase = process.env.database_name;
const mongoUser = process.env.database_user;
const mongoPassword = process.env.database_password;

// Build MongoDB connection string
var url = "mongodb://" + mongoUser + ":" + mongoPassword + "@" + mongoHost + ":" + mongoPort + "/" + mongoDatabase

const app = express();
const port = 8080;
const hostname = "0.0.0.0";

app.get('/', (req, res) => {
    // You should only see this if something has gone wrong
    output = "Bollocks";
    MongoClient.connect(url, function (err, db) {
        if (err)
            throw err;
        console.log("Database " + mongoDatabase + " exists.");
        output = "Database " + mongoDatabase + " exists.";
        db.close();
    });
  
    res.send(output)
})

app.get('/healthz', (req, res) => {
    res.send('ok');
})

app.get('/url', (req, res) => {
    res.send(url);
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
        return output;
    });
}
