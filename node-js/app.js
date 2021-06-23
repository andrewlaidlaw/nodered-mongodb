const express = require('express');
const os = require("os");

var mongo = require('mongodb'); 
const { MongoClient } = require('mongodb');

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
    /* MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db(mongoDatabase)
        var result =  dbo.collection("performance").findOne({}, function(err,result) {
            if (err) throw err;
            console.log(result);
            // res.send(result);
        });
        db.close(); 
    }); */
  
    res.send(req);
})

app.get('/connect', (req, res) => {
    const client = new MongoClient(url);
    async function run() {
      try {
        await client.connect();
        const database = client.db(mongoDatabase);
        const collection = database.collection("performance");
        const result = await collection.findOne();
        res.send(result);
      } catch (e) {
        console.log("Error: " + e);
      } finally {
        await client.close();
      }
    }
    run().catch(console.dir);
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