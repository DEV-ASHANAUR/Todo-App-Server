//dependincies
const express = require('express');
const app = express();
const cors = require("cors");
const { MongoClient } = require("mongodb");
const env = require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

//middleware
app.use(cors());
app.use(express.json());

//variable
const port = process.env.PORT || 5000;
// Connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.88ouu.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
      await client.connect();
      const database =  client.db("todo");
      const itemCollection = database.collection('item');
      //get data 
      app.get('/todo',async(req,res)=>{
        const cursor = itemCollection.find({});
        const result = await cursor.toArray();
        res.json(result);
      });
      //post data
      app.post('/todo',async(req,res)=>{
        const data = req.body;
        const result = await itemCollection.insertOne(data);
        res.json(result);
      });
      //update data
      app.put('/todo/:id',async(req,res)=>{
        const id = req.params.id;
        const itemData = req.body;
        const filter = { _id:ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            item : itemData.item,
            status : itemData.status,
          },
        };
        const result = await itemCollection.updateOne(filter, updateDoc, options);
        res.json(result);
      })
      //delete data
      app.delete('/todo/:id',async(req,res)=>{
        const id = req.params.id;
        const query = { _id : ObjectId(id)};
        const result = await itemCollection.deleteOne(query);
        res.json(result);
      });
    } finally {
        // await client.close();
    }
  }
run().catch(console.dir);
//home page
app.get('/',(req,res)=>{
  res.send("Wellcome to Todo App Server");
});
//start server
app.listen(port,()=>{
    console.log(`listening at port ${port}`);
})
