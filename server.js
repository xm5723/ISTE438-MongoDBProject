const express = require("express")
const mongo = require("mongodb").MongoClient
const { MongoClient, ServerApiVersion, GridFSBucket } = require('mongodb');
var bodyParser = require('body-parser')
var cors = require('cors')
const app = express();
var fs = require('fs');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
const uri = "mongodb+srv://admin:Group5@cluster0.0vxli.mongodb.net/CafeData?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const database = client.db('CafeData');
const cafes = database.collection('CafeInfo');
const comments = database.collection('CafeComments');
const cafesImages = database.collection('fs.files');
client.connect();
app.get('/', (req, res) => {
    res.send("Hello World");
  });

app.post("/getByCompanyName", (req, res) => {
    var companyName = req.body.companyName;
    console.log("req:" +  req.body.companyName);
    console.log(req.body);
    const query = { 'Company Name': new RegExp(`\\b${companyName}`, 'gi')};
        const options = {
            sort:  {Address: 1},
            projection: {_id:{"$toString": "$_id"},'Company Name':1, Address: 1, Phone: 1, Link: 1, Rating:1, NumReview:1}
        }
        
        cafes.find(query, options).toArray((err, items) => {
          if (err) {
            console.error(err);
            res.status(500).json({ err: err });
            return;
          }
          res.status(200).json(items);
        });

  });
  // async function findImage(objectId){
  //   const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  //   var results = [];
  //   var resultDefaultImage = [];
  //   var data = '';
  //   try{
  //       await client.connect();
  //       const database = client.db('CafeData');
  //       const cafesImages = database.collection('fs.files');
  //       const query = { 'cafeID': new RegExp(`\\b${objectId}`, 'gi')};
        
  //       const options = {
  //           projection: {_id:{"$toString": "$_id"}, filename: 1}
  //       }
  //       const cursor = cafesImages.find(query, options);
  //       // print a message if no documents were found
  //       if ((await cursor.count()) === 0) {
  //           console.log("No documents found!");
  //       }
  //       await cursor.forEach(function(item){
  //           results.push(item);
  //       }); 

  //       console.log("results", results)

  //       if(results != null && results != '') {
  //           data = results[0].filename;
  //           console.log("data", data);
  //           if (data !== 'undefined'){
  //               const bucket = new GridFSBucket(database, {bucketName: 'fs'});

  //               bucket.openDownloadStreamByName(data).
  //               pipe(fs.createWriteStream('/Users/xingmeng/Documents/school/2022Spring/ISTE483/project/image/outputFile.png')).
  //               on('error', function(error) {
  //                   assert.ifError(error);
  //               }).
  //               on('finish', function() {
  //                   process.exit(0);
  //               });
  //               return data;
  //           }
  //       }
  //       else{
  //       const query = { 'cafeID': new RegExp(`\\b12345678`, 'gi')};
    
  //       const options = {
  //           projection: {_id:{"$toString": "$_id"}, filename: 1}
  //       }
  //       const cursor = cafesImages.find(query, options);
  //       // print a message if no documents were found
  //       if ((await cursor.count()) === 0) {
  //           console.log("No documents found!");
  //       }
  //       await cursor.forEach(function(item){
  //           resultDefaultImage.push(item);
  //       }); 

  //       data = resultDefaultImage[0].filename;
  //       console.log("data", data);

  //       const bucket = new GridFSBucket(database, {bucketName: 'fs'});

  //       bucket.openDownloadStreamByName(data).
  //       pipe(fs.createWriteStream('/Users/xingmeng/Documents/school/2022Spring/ISTE483/project/image/outputFile.png')).
  //       on('error', function(error) {
  //           assert.ifError(error);
  //       }).
  //       on('finish', function() {
  //           process.exit(0);
  //       });
  //       return data;
  //   }
  app.post("/getImageByObjectID", (req, res) => {
    var objectId = req.body.objectId;
    console.log("req:" +  objectId);
    // const query = { 'cafeID': new RegExp(`\\b${objectId}`, 'gi')};
    var query;
    const options = {
      projection: {_id:{"$toString": "$_id"}, filename: 1}
    }
    
    query = { 'cafeID': new RegExp(`\\b${objectId}`, 'gi')};
    
    cafesImages.find(query, options).toArray((err, items) => {
      if (err) {
        console.error(err);
        res.status(500).json({ err: err });
        return;
      }
      console.log(items[0]);
      if(items[0] === undefined){
        query = { 'cafeID': new RegExp(`\\b12345678`, 'gi')};
        const cursor = cafesImages.find(query, options).toArray((err, items) => {
          if (err) {
            console.error(err);
            res.status(500).json({ err: err });
            return;
          }
          data = items[0].filename;
          console.log("data", data);
          const bucket = new GridFSBucket(database, {bucketName: 'fs'});
          
          bucket.openDownloadStreamByName(data).
          pipe(fs.createWriteStream('./images/outputFile.png')).
          on('error', function(error) {
              console.log(error);
          }).
          on('finish', function() {
              // process.exit(0);
          });
          res.status(200).json(items);
        });
      }else{
        data = items[0].filename;
        console.log("data", data);
        const bucket = new GridFSBucket(database, {bucketName: 'fs'});
        
        bucket.openDownloadStreamByName(data).
        pipe(fs.createWriteStream('./images/outputFile.png')).
        on('error', function(error) {
            console.log(error);
        }).
        on('finish', function() {
            // process.exit(0);
        });
        res.status(200).json(items);
        }
      
    });
    

    
    
        // print a message if no documents were found
    
    
  });

  app.post("/search", (req, res) => {
    var companyName = req.body.companyName;
    console.log("req:" +  req.body.companyName);
    const query = { 'Company Name': new RegExp(`\\b${companyName}`, 'gi')};
    const options = {
        sort:  {Address: 1},
        projection: {'Company Name':1}
    }
        
    cafes.find(query, options).toArray((err, items) => {
      if (err) {
        console.error(err);
        res.status(500).json({ err: err });
        return;
      }
      res.status(200).json(items);
    });

  });

  app.post("/getCommentsByID", (req, res) => {
    console.log("req:" +  req.body.cafeID);
    var cafeID = req.body.cafeID;
    const query = { objectId: cafeID};
    const options = {
        projection: {_id:0,comment:1}
    }
        
    comments.find(query, options).toArray((err, items) => {
      if (err) {
        console.error(err);
        res.status(500).json({ err: err });
        return;
      }
      res.status(200).json(items);
    });
  });

  app.post("/setCafeComment", (req, res) => {
    var objectId = req.body.objectId;
    var comment = req.body.comment;
    comments.insertOne({objectId: objectId, comment: comment  }, (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).json({ err: err })
        return
      }
      console.log(result)
      res.status(200).json({ ok: true })
    });
  });
  // var myObj = { objectId: objectId, comment: comment };
  //       await comments.insertOne(myObj);
  app.listen(3000, () => console.log("Server ready"))