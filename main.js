
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:Group5@cluster0.0vxli.mongodb.net/CafeData?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const database = client.db('CafeData');
const cafes = database.collection('CafeInfo');
async function findCafe(search) {
    try {
        await client.connect();
        const database = client.db('CafeData');
        const cafes = database.collection('CafeInfo');

        const query = { 'Company Name': new RegExp(`\\b${search}`, 'gi')};
        const options = {
            sort:  {Address: 1},
            projection: {_id: 0, 'Company Name':1, Address: 1, Phone: 1, Link: 1}
        }

        const cursor = cafes.find(query, options);

        // print a message if no documents were found
        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
        }

        // replace console.dir with your callback to access individual elements
        await cursor.forEach(console.dir);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
findCafe('caf').catch(console.dir);