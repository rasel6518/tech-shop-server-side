const express = require('express');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());








const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_PASS}@cluster0.j6xnqa4.mongodb.net/?retryWrites=true&w=majority`;
// const uri = `mongodb+srv://brandsproduct:FbVGpB14qyIU1kMJ@cluster0.j6xnqa4.mongodb.net/?retryWrites=true&w=majority`;

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



        const brandCollection = client.db('brandsDB').collection('brands')
        const newCollection = client.db('newProductDB').collection('newProducts')
        const bestCollection = client.db('bestsellerDB').collection('bestSellers')
        const mycartCollection = client.db('mycartDB').collection('cartItems');
        const brandnameCollection = client.db('brandsnameDB').collection('brandname');



        app.get('/brandname', async (req, res) => {
            const cursor = brandnameCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/brands', async (req, res) => {
            const cursor = brandCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })


        app.get('/brands/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await brandCollection.findOne(query);
            res.send(result)
        })

        app.put('/brands/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateBrands = req.body;
            const brands = {
                $set: {
                    name: updateBrands.name,
                    brand: updateBrands.brand,
                    type: updateBrands.type,
                    price: updateBrands.price,
                    rating: updateBrands.rating,
                    description: updateBrands.description,
                    photo: updateBrands.photo,
                }
            }
            const result = await brandCollection.updateOne(filter, brands, options);
            res.send(result)
        })

        app.get('/newProducts', async (req, res) => {
            const cursor = newCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/bestSellers', async (req, res) => {
            const cursor = bestCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })




        app.get('/cartItems', async (req, res) => {
            const cursor = mycartCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })



        app.post('/cartItems', async (req, res) => {
            const productDetails = req.body;
            delete productDetails._id
            const result = await mycartCollection.insertOne(productDetails);
            res.send(result);
        });



        app.post('/brands', async (req, res) => {
            const newBrand = req.body;
            console.log(newBrand);
            const result = await brandCollection.insertOne(newBrand);
            res.send(result)
        })


        app.delete('/cartItems/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await mycartCollection.deleteOne(query);
            res.send(result)
        })



        // Send a ping to confirm a successful connection

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('brands product server is running')


})


app.listen(port, () => {
    console.log(`brand product server is running on port : ${port} `);
})