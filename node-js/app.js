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
var url = "mongodb+srv://" + mongoUser + ":" + mongoPassword + "@" + mongoHost + ":" + mongoPort + "/" + mongoDatabase
// var url = "mongodb+srv://" + mongoUser + ":" + mongoPassword + "@" + mongoHost + "/" + mongoDatabase
// var url = "mongodb://localhost:27017/performance"

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
    res.send(req.query);
})

app.get('/connect', (req, res) => {
    const client = new MongoClient(url);
    async function run() {
      try {
        await client.connect();
        const database = client.db(mongoDatabase);
        const collection = database.collection("performance");
        var queryString = req.query;
        console.log(queryString);
        collection.find(queryString).toArray(function(error, results) {
            if (error) throw error;
            console.log(results);
            res.send(results);
        });
        //res.json(result);
      } catch (e) {
        console.log("Error: " + e);
      } finally {
        await client.close();
      }
    }
    run().catch(console.dir);
})

app.get('/findall', (req, res) => {
    // console.log(url);
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("connection created");
    async function findall(findQuery) {
        var result = ""
        try {
            await client.connect();
            console.log("connected");
            const collection = client.db("performance").collection("performance");
            console.log("collection set");
            console.log("query is: " + JSON.stringify(findQuery));
            result = await collection.find(findQuery).toArray();
            console.log("search completed");
        } finally {
            await client.close();
            console.log("client closed");
        }
        console.log("returning result:");
        console.log(result);
        res.send(result);
    }
    
    findall(req.query).catch(console.dir);
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