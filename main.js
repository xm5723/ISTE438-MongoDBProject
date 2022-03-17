
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
        //const query = {text: /\b${search}\b/i}
        //const query = {'Company Name': new RegExp(`/\b${search}\b/i`)};
        //const query = {text: /\b${search}\b/i}
        const options = {
            sort:  {Address: 1},
            projection: {_id: 0, Address: 1, Phone: 1, Link: 1}
        }

        //const query = { 'Company Name': { $regex: `/\b${search}\b/i` }};
        const cursor = cafes.find(query, options);

        //cafes.find( { 'Company Name': { $regex: `/\b${search}\b/i` } } )

        // print a message if no documents were found
        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
        }

        // replace console.dir with your callback to access individual elements
        await cursor.forEach(console.dir);

        // const cafe = cafes.find(query);
        // while (cafe.hasNext()){
        //     //printjson(cursor.next());
        //     doc = cafe.next();
        //     console.log(doc.Address);
        //     console.log(doc.Rating);
        //     console.log(doc.text);
        // }
        // console.log(cafe);
        
        // var query = new RegExp(`/\b${search}\b/i`);
        // const cafe = await cafes.findOne(query);
        // console.log(cafe);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

async function findCafe2(search) {
    try {
        await client.connect();
        const database = client.db('CafeData');
        const cafes = database.collection('CafeInfo');

        const query = { 'Company Name': /\b\b/i };
        //const query = {text: /\b${search}\b/i}
        //const query = {'Company Name': new RegExp(`/\b${search}\b/i`)};
        //const query = {text: /\b${search}\b/i}
        const options = {
            sort:  {Address: 1},
            projection: {_id: 0, Address: 1, Phone: 1, Link: 1}
        }

        //const query = { 'Company Name': { $regex: `/\b${search}\b/i` }};
        const cursor = cafes.find(query, options);

        //cafes.find( { 'Company Name': { $regex: `/\b${search}\b/i` } } )

        // print a message if no documents were found
        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
        }

        // replace console.dir with your callback to access individual elements
        await cursor.forEach(console.dir);

        // const cafe = cafes.find(query);
        // while (cafe.hasNext()){
        //     //printjson(cursor.next());
        //     doc = cafe.next();
        //     console.log(doc.Address);
        //     console.log(doc.Rating);
        //     console.log(doc.text);
        // }
        // console.log(cafe);
        
        // var query = new RegExp(`/\b${search}\b/i`);
        // const cafe = await cafes.findOne(query);
        // console.log(cafe);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}



findCafe('Hard rock cafe').catch(console.dir);