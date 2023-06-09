const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

app.use(express.json())
app.use(cors())


app.get('/', (req, res) => {
  res.send('Beast is runnign')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uvrlcrq.mongodb.net/?retryWrites=true&w=majority`;

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
    client.connect();

    const foodData = client.db('foodData').collection('foods')
    const reviewData = client.db('foodData').collection('reviews')
    const cartData = client.db('foodData').collection('carts')

    app.get('/foods', async (req, res) => {
      const result = await foodData.find().toArray()
      res.send(result)
    })

    app.get('/reviews', async (req, res) => {
      const result = await reviewData.find().toArray()
      res.send(result)
    })


    //cart collection

    app.get('/carts', async (req, res) => {
      const userEmail = req.query.email;
      if (!userEmail) {
        return res.send([])
      }
      const query = {email: userEmail}
      const result = await cartData.find(query).toArray()
      res.send(result)
    })

    app.post('/carts', async (req, res) => {
      const item = req.body;
      console.log(item)
      const result = await cartData.insertOne(item);
      res.send(result)
    })

    app.delete('/carts/:id', async(req, res) => {
      const id = req.params.id;
      const qurey = {_id: id};
      const result = await cartData.deleteOne(qurey)
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


app.listen(port, () => {
  console.log(`Beast is running on ${port}`)
})