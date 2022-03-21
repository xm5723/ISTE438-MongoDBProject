
const { MongoClient, ServerApiVersion, GridFSBucket } = require('mongodb');
const uri = "mongodb+srv://admin:Group5@cluster0.0vxli.mongodb.net/CafeData?retryWrites=true&w=majority";

async function findCafeDetails(search) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    var results = [];
    try {
        const database = client.db('CafeData');
        const cafes = database.collection('CafeInfo');

        const query = { 'Company Name': new RegExp(`\\b${search}`, 'gi')};
        const options = {
            sort:  {Address: 1},
            projection: {_id:{"$toString": "$_id"},'Company Name':1, Address: 1, Phone: 1, Link: 1, Rating:1, NumReview:1}
        }

        const cursor = cafes.find(query, options);

        // print a message if no documents were found
        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
        }

        await cursor.forEach(function(item){
            results.push(item);
        }); 


        // console.log(results);
        return results;
    } finally {
        await client.close();
    }
}

async function search(search) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    var results = [];
    try {
        await client.connect();
        const database = client.db('CafeData');
        const cafes = database.collection('CafeInfo');

        const query = { 'Company Name': new RegExp(`\\b${search}`, 'gi')};
        const options = {
            sort:  {Address: 1},
            projection: {'Company Name':1}
        }

        const cursor = cafes.find(query, options);

        // print a message if no documents were found
        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
        }
        
        await cursor.forEach(function(item){
            results.push(item);
            
        }); 
        // console.log(results);
        return results;
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

async function findImage(objectId){
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    var results = [];
    var data = '';
    try{
        await client.connect();
        const database = client.db('CafeData');
        const cafesImages = database.collection('fs.files');
        const query = { 'cafeID': new RegExp(`\\b${objectId}`, 'gi')};
        const options = {
            projection: {_id:{"$toString": "$_id"}, filename: 1}
        }
        const cursor = cafesImages.find(query, options);
        // print a message if no documents were found
        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
        }
        await cursor.forEach(function(item){
            results.push(item);
        }); 
        // console.log(results);
        data = JSON.stringify(results[0].filename);
        //gfs.openDownloadStreamByName(data).pipe(res);
        return data;
    }
    finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

async function cafeComments(objectId, comment){
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    try{
        await client.connect();
        const database = client.db('CafeData');
        const cafes = database.collection('CafeComments');
        
        var myObj = { objectId: objectId, comment: comment };
        const insert = cafes.insertOne(myObj);
    }
    finally {
        await client.close();
    }
}

//for frontend: update UI inside the 'then' 
search('Hard Rock cafe').then(function(results){
    //update UI here using results array
    console.log(results);
}).catch(console.dir);


//for frontend: update UI inside the 'then' 
findCafeDetails('caf').then(function(results){
    //update UI here using results array
    console.log(results);
}).catch(console.dir);

findImage('6211595e83f42d30651d2e3e').then(function(data){
    //update UI here using results array
    console.log(data);
}).catch(console.dir);