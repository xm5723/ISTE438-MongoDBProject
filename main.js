
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
async function setCafeComment(objectId, comment){
    try{
        await client.connect();
        const database = client.db('CafeData');
        const comments = database.collection('CafeComments');
        
        var myObj = { objectId: objectId, comment: comment };
        await comments.insertOne(myObj);
    }
    finally {
        await client.close();
    }
}

async function getCommentsByID(cafeObjectId) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    var results = [];
    try {
        await client.connect();
        const database = client.db('CafeData');
        const comments = database.collection('CafeComments');
        const query = { objectId: cafeObjectId};
        const options = {
            projection: {_id:0,comment:1}
        }

        const cursor = comments.find(query, options);

        // print a message if no documents were found
        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
        }

        await cursor.forEach(function(item){
            results.push(item);

        }); 


        // console.log(results);
        // var json = JSON.stringify(results);
        return results;
    } finally {
        await client.close();
    }
}

async function findImage(objectId){
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    var results = [];
    var resultDefaultImage = [];
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

        console.log("results", results)

        if(results != null && results != '') {
            data = results[0].filename;
            console.log("data", data);
            if (data !== 'undefined'){
                const bucket = new GridFSBucket(database, {bucketName: 'fs'});

                bucket.openDownloadStreamByName(data).
                pipe(fs.createWriteStream('/Users/xingmeng/Documents/school/2022Spring/ISTE483/project/image/outputFile.png')).
                on('error', function(error) {
                    assert.ifError(error);
                }).
                on('finish', function() {
                    process.exit(0);
                });
                return data;
            }
        }
        else{
            const query = { 'cafeID': new RegExp(`\\b12345678`, 'gi')};
        
            const options = {
                projection: {_id:{"$toString": "$_id"}, filename: 1}
            }
            const cursor = cafesImages.find(query, options);
            // print a message if no documents were found
            if ((await cursor.count()) === 0) {
                console.log("No documents found!");
            }
            await cursor.forEach(function(item){
                resultDefaultImage.push(item);
            }); 

            data = resultDefaultImage[0].filename;
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
            return data;
        }
        
    }
    finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
        console.log("finally")
    }
}

async function createLocation(){
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    results = [];
    try {
        await client.connect();
        const database = client.db('CafeData');
        const cafes = database.collection('CafeInfo');

        cafes.find().forEach(
            function (e) {
                // update document, using its own properties
                // Check to see if latitude is in the document
                //Sloppy coding alert - I hould have check longitude also, but it works here
                if ('Latitude' in e && e.Latitude !== ""){
                    var ll = {Longitude : e.Longitude, Latitude: e.Latitude};
                    var lla =[]; //an array
                    //fills the array with longitude and latitude
                    Object.keys(ll).forEach(function(key) {
                    var val = ll[key];
                    lla.push(val);
                })
                var p = "Point";
                // Create location variable in document - see how this compares with the slides
                loc = {type: p, coordinates: lla};     	
                        
                // save the updated document
                wc = cafes.updateOne({_id: e._id}, {$set:{loc}})
                }
            }
        )	
    
        cafes.createIndex( { loc : "2dsphere" });
        console.log("Here");
        return results;
    }
    catch(error) {
        console.log("That did not go well");
        console.error(error);
    }
    finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

async function findLocations(longitude, latitude) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    results = [];
    try {
        await client.connect();
        const database = client.db('CafeData');
        const cafes = database.collection('CafeInfo');

        // const cursor = cafes.find(
        //     { loc:
        //         { $near:
        //             { $geometry:
        //                 {
        //                     type: "Point",
        //                     coordinates: [longitude, latitude]
        //                 },
        //                 $maxDistance: 1000
        //             }
        //         }
        //     }
        // )

        // const cursor = cafes.find(
        //     {
        //       loc:
        //         { $near:
        //            {
        //              $geometry: { type: "Point",  coordinates: [longitude, latitude] },
        //              $minDistance: 1000,
        //              $maxDistance: 5000
        //            }
        //         }
        //     }
        //  )

        const options = {
            sort:  {Address: 1},
            projection: {'Company Name':1, Address: 1}
        }

        const query = {
            "loc": {
              $near: {
                $geometry: { type: "Point", coordinates: [longitude, latitude] },
                $maxDistance: 1000,
              },
            },
          };
        const cursor = cafes.find(query, options);

        // print a message if no documents were found
        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
        }
        
        await cursor.forEach(function(item){
            results.push(item); 
        }); 

        process.on('unhandledRejection', error => {
            // Will print "unhandledRejection err is not defined"
            console.log('unhandledRejection', error.message);
          });
          
        new Promise((_, reject) => reject(new Error('woops'))).
            catch(error => {
            // Will not execute
            console.log('caught', err.message);
            });
        return results;
    }
    catch(error) {
        console.log("That did not go well");
        console.error(error);
    }
    finally {
        // Ensures that the client will close when you finish/error
        console.log("close")
        await client.close();
    }
}

//for frontend: update UI inside the 'then' 
// search('Hard Rock cafe').then(function(results){
//     //update UI here using results array
//     console.log(results);
// }).catch(console.dir);


// //for frontend: update UI inside the 'then' 
// findCafeDetails('Hard Rock cafe').then(function(results){
//     //update UI here using results array
//     for (var i=0; i<results.length;i++){
//         console.log(results[i].Address);
//     }
//     console.log(results);
// }).catch(console.dir);


// // setCafeComment('6211595e83f42d30651d2e5e','this is a test comment');

// getCommentsByID('6211595e83f42d30651d2e5e').then(function(results){
//     //update UI here using results array
//     for (var i=0; i<results.length;i++){
//         console.log(results[i].comment);
//     }

// }).catch(console.dir);

// //6211595e83f42d30651d2e3e
// findImage('6211595e83f42d30651d2e50').then(function(data){
//     //update UI here using results array
   
//     // var imageUrl = new URL(data.toString);
//     console.log(data);
//     // var readStream = fs.createReadStream({filename:imageUrl});
//     // readStream.pipe(res);
// }).catch(console.dir);

createLocation();

findLocations(12.97406376, 77.59459773).then(function(data){
    //update UI here using results array
   
    // var imageUrl = new URL(data.toString);
    console.log(data);
    // var readStream = fs.createReadStream({filename:imageUrl});
    // readStream.pipe(res);
}).catch(console.dir);