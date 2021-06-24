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

// Used for OpenShift environment
var url = "mongodb://" + mongoUser + ":" + mongoPassword + "@" + mongoHost + ":" + mongoPort + "/" + mongoDatabase
// Used for local testing
// var url = "mongodb://localhost:27017/performance"

const app = express();
const port = 8080;
const hostname = "0.0.0.0";

function integise(query) {
    if (query.model) query.model = parseInt(query.model);
    if (query.sockets) query.sockets = parseInt(query.sockets);
    if (query.coresPerSocket) query.coresPerSocket = parseInt(query.coresPerSocket);
    if (query.totalCores) query.totalCores = parseInt(query.totalCores);
    if (query.frequencyGHz) query.frequencyGHz = parseFloat(query.frequencyGHz);
    return query;
}

app.get('/', (req, res) => {
    res.send("ok");
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
            const collection = client.db(mongoDatabase).collection("performance");
            console.log("collection set");
            findQuery = integise(findQuery);
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
    var output = "This is the value: " + JSON.stringify(req.query);
    res.send(output);
})

app.listen(port, hostname, () => {
    console.log(`MongoDB app listening at http://${hostname}:${port}`)
})