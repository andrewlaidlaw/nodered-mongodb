const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017/performance?retryWrites=true&w=majority";
//const uri = "";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log("client created");

async function findall(findQuery) {
    var result = ""
    try {
        await client.connect();
        console.log("connected");
        const collection = client.db("performance").collection("performance");
        console.log("collection set");

        result = await collection.find(findQuery).toArray();
        console.log("search completed");
        console.log(result);
    } finally {
        await client.close()
    }
    return result;
}

var output = findall({"commonName": "E980"}).catch(console.dir);
console.log("Response is:")
console.log(output);