const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    app.post('/addTechToy', async (req, res) => {
      const techToyCard = req.body
      const result = await techToyCollection.insertOne(techToyCard)
      res.send(result)
    })
    // get all data 
    app.get('/addTechToy', async (req, res) => {
      const result = await techToyCollection.find().limit(20).toArray()
      res.send(result)
    })
    // get single data 
    app.get('/toysDetails/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await techToyCollection.find(query).toArray()
      res.send(result)
    })
    // get only my job data
    app.get("/myToys/:email", async (req, res) => {
      const result = await techToyCollection.find({
        sellerEmail: req.params.email
      }).toArray()
      res.send(result)
    })
    // get data by category 
    app.get("/toysByCategory/:subCategory", async (req, res) => {
      const result = await techToyCollection.find({
        subCategory: req.params.subCategory
      }).toArray()
      res.send(result)
    })
    // get toys data by searching 
    app.get('/getToysByText/:text', async (req, res) => {
      const text = req.params.text
      const result = await techToyCollection.find({
        productName: { $regex: text, $options: "i" }
      }).toArray()
      res.send(result)
    })
    // get data Ascending Descending Order based on price
    app.get('/sortingByPrice', async (req, res) => {
      const sort = req.query.sort
      const email = req.query.email
      let sorting;
      if (sort === 'asc') {
        sorting = 1
      } else if (sort === 'desc') {
        sorting = -1
      }
      const result = await techToyCollection.find({sellerEmail: email}).sort({ price: sorting}).toArray();
      res.send(result)
    })
    // update single toys
    app.put('/updateToys/:id', async (req, res) => {
      const id = req.params.id
      const updateToys = req.body
      const filter = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {
          price: updateToys.price,
          quantity: updateToys.quantity,
          description: updateToys.description

        }
      }
      const result = await techToyCollection.updateOne(filter, updateDoc)
      res.send(result)
    })
    // delete toys
    app.delete('/deleteToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await techToyCollection.deleteOne(query)
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