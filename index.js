const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const fileUpload = require('express-fileupload');
const ObjectId = require('mongodb').ObjectId;

// middleare
app.use(fileUpload());
app.use(cors());
app.use(express.json());


async function run() {

    // mongo db uri

    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.39aol.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


    try {
        await client.connect();
        const database = client.db("Tourism");
        const ourDivions = database.collection('divisions');
        const ourPlaces = database.collection('places');
        const usersCollection = database.collection('users');
        const reviewCollection = database.collection('reviewCollection');


        // get all divisions 
        app.get('/divisions', async (req, res) => {
            res.send(await ourDivions.find({}).toArray());
        })

        // get all places 
        app.get('/places', async (req, res) => {
            res.send(await ourPlaces.find({}).toArray());
        });

        // get user review 
        app.get('/review', async (req, res) => {
            res.send(await reviewCollection.find({}).toArray());
        });

        // saver user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        // save user google sign
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });


    }
    finally {
        // await client.close()
    }

}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('welcome to bangla tourism');
})

app.listen(port, () => {
    console.log(`My server is running`);
})