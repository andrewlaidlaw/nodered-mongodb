// Prepare necessary pre-requisites
const express = require('express');
const os = require("os");
// var mongo = require('mongodb'); 
const { MongoClient } = require('mongodb');
const http = require('http');

// Collect database settings from environment variables
const mongoHost = process.env.database_host;
const mongoPort = process.env.database_port;
const mongoDatabase = process.env.database_name;
const mongoUser = process.env.database_user;
const mongoPassword = process.env.database_password;
const mongoCollection = process.env.database_collection;

// Build MongoDB connection string
//================================
// Used for OpenShift environment
var url = "mongodb://" + mongoUser + ":" + mongoPassword + "@" + mongoHost + ":" + mongoPort + "/" + mongoDatabase
// Used for local testing
// var url = "mongodb://localhost:27017/performance"
console.log("MongoDB instance is at: " + url)

// Set Express.js to listen for all connections
const app = express();
const port = 8080;
const hostname = "0.0.0.0";

// Function to clean up the entries from a HTTP query (destringify)
function destringify(query) {
    if (query.model) query.model = parseInt(query.model);
    if (query.sockets) query.sockets = parseInt(query.sockets);
    if (query.coresPerSocket) query.coresPerSocket = parseInt(query.coresPerSocket);
    if (query.totalCores) query.totalCores = parseInt(query.totalCores);
    if (query.frequencyGHz) query.frequencyGHz = parseFloat(query.frequencyGHz);
    return query;
}

// Basic response on /
app.get('/', (req, res) => {
    res.send("ok");
})

// Searches performance collection using query modifier from HTTP query
app.get('/findall', (req, res) => {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("connection created");
    data = findall(req.query, client).catch(console.dir);
    res.send(JSON.parse(data));
})

app.get('/maxrperf', (req, res) => {

    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    var maxrPerf = 0.0;
    var searchQuery = '';
    if (req.query.model) {searchQuery += 'model=' + req.query.model + '&'};
    if (req.query.type) {searchQuery += 'type=' + req.query.type + '&'};
    if (req.query.totalCores) {searchQuery += 'totalCores=' + parseInt(req.query.totalCores)};
    
    servers = findall(searchQuery, client);

    servers.forEach(findhighest);
    if (maxrPerf == 0.0) {
        res.send("An error occured");
    } else {
        res.send(maxrPerf.toString());
    }
    console.log("Max: " + minrPerf);
    
    function findhighest(server, index, array) {
        var highestrPerf = 0.0;
        if (server.rperfST) {highestrPerf = server.rperfST};
        if (server.rperfSMT2) {highestrPerf = server.rperfSMT2};
        if (server.rperfSMT4) {highestrPerf = server.rperfSMT4};
        if (server.rperfSMT8) {highestrPerf = server.rperfSMT8};
        if (highestrPerf > maxrPerf) {maxrPerf = highestrPerf};
        console.log("Highest rPerf is: " + highestrPerf);
    }
})

app.get('/minrperf', (req, res) => {

    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    var minrPerf = 1000000.0;
    var searchQuery = '';
    if (req.query.model) {searchQuery += 'model=' + req.query.model + '&'};
    if (req.query.type) {searchQuery += 'type=' + req.query.type + '&'};
    if (req.query.totalCores) {searchQuery += 'totalCores=' + parseInt(req.query.totalCores)};

    servers = findall(searchQuery, client);

    servers.forEach(findhighest);
    if (minrPerf == 1000000.0) {
        res.send("An error occured");
    } else {
        res.send(minrPerf.toString());
    }
    console.log("Min: " + minrPerf);
    
    function findhighest(server, index, array) {
        var highestrPerf = 0.0;
        if (server.rperfST) {highestrPerf = server.rperfST};
        if (server.rperfSMT2) {highestrPerf = server.rperfSMT2};
        if (server.rperfSMT4) {highestrPerf = server.rperfSMT4};
        if (server.rperfSMT8) {highestrPerf = server.rperfSMT8};
        if (highestrPerf < minrPerf) {minrPerf = highestrPerf};
        console.log("Lowest rPerf is: " + highestrPerf);
    }

})

// Healthcheck on /healthz
app.get('/healthz', (req, res) => {
    res.send('ok');
})

// Shows the URL of the MongoDB instance
app.get('/url', (req, res) => {
    res.send(url);
})

// FUNCTIONS

// Primary function to look up values in MongoDB database
async function findall(findQuery, client) {
    var result = ""
    try {
        await client.connect();
        console.log("connected");
        const collection = client.db(mongoDatabase).collection(mongoCollection);
        console.log("collection set");
        findQuery = destringify(findQuery);
        console.log("query is: " + JSON.stringify(findQuery));
        result = await collection.find(findQuery).toArray();
        console.log("search completed");
    } finally {
        await client.close();
        console.log("client closed");
    }
    result.sort(function(a, b) {
        return parseInt(a.totalCores) - parseFloat(b.totalCores);
    });
    console.log("Result is: " + result);
    return result;
}


// Deploy web server and log status
app.listen(port, hostname, () => {
    console.log(`MongoDB app listening at http://${hostname}:${port}`)
})