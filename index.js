const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jr39v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("medicareDB");
    const servicesCollection = database.collection("services");
    const doctorsCollection = database.collection("doctors");
    const countsCollection = database.collection("counts");

    // GET ALL SERVICES
    app.get("/services", async (req, res) => {
      const result = await servicesCollection.find({}).toArray();
      res.json(result);
    });
    // GET ONE SERVICE
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.findOne(query);
      res.json(result);
    });
    // GET ALL DOCTORS
    app.get("/doctors", async (req, res) => {
      const result = await doctorsCollection.find({}).toArray();
      res.json(result);
    });
    // GET ALL COUNTS
    app.get("/counts", async (req, res) => {
      const result = await countsCollection.find({}).toArray();
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Medicare Hospital Server!");
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
