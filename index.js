const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()
// middleware
app.use(cors());
app.use(express.json());

// TechToy
// UtElePkGeVsyiZQO


// mongodb code

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c9irx2a.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("insertDB");
    const haiku = database.collection("haiku");
    const techToyCollection = client.db('TechToy').collection('Tech')
    // post data 
    app.post('/addTechToy', async(req,res)=>{
        const techToyCard = req.body
        const result = await techToyCollection.insertOne(techToyCard)
        res.send(result)
    })
    // get all data 
    app.get('/addTechToy', async(req,res)=>{
        const result = await techToyCollection.find().toArray()
        res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`TechToy server running on the port: ${port}`)
})