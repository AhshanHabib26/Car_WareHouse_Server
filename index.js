const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//MiddleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cgq9d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function carHouse() {
  try {
    await client.connect();
    const carHouseCollection = client
      .db("dealerCollection")
      .collection("dealer");

    app.get("/items", async (req, res) => {
      const query = {};
      const item = carHouseCollection.find(query);
      const result = await item.toArray();
      res.send(result);
    });

    
  }
  
  
  
  
  finally {
  }
}

carHouse().catch(console.dir());

app.get("/", (req, res) => {
  res.send("I Am Ahshan Habib!");
});

app.listen(port);
