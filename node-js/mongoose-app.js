const express = require('express');
const os = require("os");

const mongoose = require("mongoose");

// var mongo = require('mongodb'); 
// var MongoClient = require('mongodb').MongoClient;

// Collect database settings
const mongoHost = process.env.database_host;
const mongoPort = process.env.database_port;
const mongoDatabase = process.env.database_name;
const mongoUser = process.env.database_user;
const mongoPassword = process.env.database_password;

// Build MongoDB connection string
var url = "mongodb://" + mongoUser + ":" + mongoPassword + "@" + mongoHost + ":" + mongoPort + "/" + mongoDatabase

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();
const port = 8080;
const hostname = "0.0.0.0";

app.get('/connect', (req, res) => {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        res.send('Connected')
        // we're connected!
    });
});

app.get('/', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db(mongoDatabase)
        dbo.collection("performance").findOne({},function(err,result) {
            if (err) throw err;
            console.log(result);
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
    var output = "This is the value: " + req.query.value;
    res.send(output);
})

app.listen(port, hostname, () => {
    console.log(`MongoDB app listening at http://${hostname}:${port}`)
})