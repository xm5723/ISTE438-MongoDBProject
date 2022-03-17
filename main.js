
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
        const query = { 'Company Name': /\b\b/i };
        const cafe = await cafes.findOne(query);
        console.log(cafe);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
findCafe('Hard rock cafe').catch(console.dir);
