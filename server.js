const express = require("express")
const mongo = require("mongodb").MongoClient
const { MongoClient, ServerApiVersion } = require('mongodb');
var bodyParser = require('body-parser')
var cors = require('cors')
const app = express();

app.use(cors());
// app.use(express.urlencoded({
//   extended: true
// }))
app.use(bodyParser.urlencoded({ extended: true }));
const uri = "mongodb+srv://admin:Group5@cluster0.0vxli.mongodb.net/CafeData?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const database = client.db('CafeData');
const cafes = database.collection('CafeInfo');
const comments = database.collection('CafeComments');
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

  app.get("/search", (req, res) => {
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

  app.get("/getCommentsByID", (req, res) => {
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
    })
  });
  // var myObj = { objectId: objectId, comment: comment };
  //       await comments.insertOne(myObj);
  app.listen(3000, () => console.log("Server ready"))