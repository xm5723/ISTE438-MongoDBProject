
const { MongoClient, ServerApiVersion, GridFSBucket, createWriteStream } = require('mongodb');
const uri = "mongodb+srv://admin:Group5@cluster0.0vxli.mongodb.net/CafeData?retryWrites=true&w=majority";
var fs = require('fs');

async function findCafeDetails(search) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    var results = [];
    try {
        await client.connect();
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
        }else{
            await cursor.forEach(function(item){
                results.push(item);
    
            });
        }

         


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

        data = results[0].filename;
        console.log("data", data);
        const bucket = new GridFSBucket(database, {bucketName: 'fs'});

        bucket.openDownloadStreamByName(data).
        pipe(fs.createWriteStream('/Users/xingmeng/Documents/school/2022Spring/ISTE483/project/image/outputFile.png')).
        on('error', function(error) {
            assert.ifError(error);
        }).
        on('finish', function() {
            process.exit(0);
        });

        // append the image to the browser
        // default image

        return data;
    }
    finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
        console.log("finally")
    }
}

//for frontend: update UI inside the 'then' 
search('Hard Rock cafe').then(function(results){
    //update UI here using results array
    console.log(results);
}).catch(console.dir);


//for frontend: update UI inside the 'then' 
findCafeDetails('Hard Rock cafe').then(function(results){
    //update UI here using results array
    for (var i=0; i<results.length;i++){
        console.log(results[i].Address);
    }
    console.log(results);
}).catch(console.dir);


// setCafeComment('6211595e83f42d30651d2e5e','this is a test comment');

getCommentsByID('6211595e83f42d30651d2e5e').then(function(results){
    //update UI here using results array
    for (var i=0; i<results.length;i++){
        console.log(results[i].comment);
    }

}).catch(console.dir);

findImage('6211595e83f42d30651d2e3e').then(function(data){
    //update UI here using results array
   
    // var imageUrl = new URL(data.toString);
    console.log(data);
    // var readStream = fs.createReadStream({filename:imageUrl});
    // readStream.pipe(res);
}).catch(console.dir);