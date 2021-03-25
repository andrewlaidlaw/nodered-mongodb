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
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db(mongoDatabase)
        dbo.collection("performance").findOne({},function(err,result) {
            if (err) throw err;
            console.log(result.name);
        });
        db.close();
    });
  
    res.send("done");
})

app.get('/healthz', (req, res) => {
    res.send('ok');
})

app.get('/url', (req, res) => {
    res.send(url);
})

app.get('/test', (req, res) => {
    var output = "This is the value: " + req.value;
    res.send(output);
})

app.listen(port, hostname, () => {
    console.log(`MongoDB app listening at http://${hostname}:${port}`)
})