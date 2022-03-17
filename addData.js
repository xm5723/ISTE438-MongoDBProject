
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:Group5@cluster0.0vxli.mongodb.net/CafeData?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//     // const collection = client.db("CafeData").collection("CafeInfo");
//     // perform actions on the collection object
//     console.log('here');
//     findOneCafe();
//     // client.close();
// });

async function run() {
    try {
        await client.connect();
        const database = client.db('CafeData');
        const cafes = database.collection('CafeInfo');
        // Query for a movie that has the title 'Back to the Future'
        const query = { 'Company Name': 'Hard Rock Cafe' };
        const cafe = await cafes.findOne(query);
        console.log(cafe);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);

// var findOneCafe = function () {
//     return new Promise(function (resolve, reject) {
//         const collection = client.db("CafeData").collection("CafeInfo");

//         var cursor = collection.findOne({ 'Company Name': 'Hard Rock Cafe' });
//         console.log(cursor);
//         client.close();
//     })
// }