const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const { status } = require("express/lib/response");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 5000;

//MiddleWare
app.use(cors());
app.use(express.json());

// function verifyJWT(req, res, next) {
//   const auth = req.headers.authorization;
//   if (!auth) {
//     return res.status(401).send({ message: "Unathoraized Access" });
//   }
//   const token = auth.split(" ")[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
//     if (err) {
//       return res.status(403).send({ meassage: "Forbiden Access" });
//     }
//     req.decoded = decoded;
//   });
//   next();
// }

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

    const userItemsCollection = client
      .db("dealerCollection")
      .collection("addedItem");

    app.post("/getToken", async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN);
      res.send({ accessToken });
    });

    app.post("/additem", async (req, res) => {
      const additem = req.body;
      const result = await userItemsCollection.insertOne(additem);
      res.send(result);
    });

    app.get("/additem", async (req, res) => {
      const auth = req.headers.authorization;
      const [email, token] = auth.split(" ");
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
      if (email === decoded.email) {
        const additem = userItemsCollection.find(query);
        const result = await additem.toArray();
        res.send(result);
      }
    });

    app.get("/item", async (req, res) => {
      const query = {};
      const item = carHouseCollection.find(query);
      const result = await item.toArray();
      res.send(result);
    });

    app.get("/item/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carHouseCollection.findOne(query);
      res.send(result);
    });

    app.post("/item", async (req, res) => {
      const query = req.body;
      const result = await carHouseCollection.insertOne(query);
      res.send(result);
    });

    app.put("/item/:id", async (req, res) => {
      const id = req.params.id;
      const updatedItem = req.body;
      const itemFilter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = { $set: updatedItem };

      const result = await carHouseCollection.updateOne(
        itemFilter,
        updatedDoc,
        options
      );
      res.send(result);
    });
  } finally {
  }
}

carHouse().catch(console.dir());

app.get("/", (req, res) => {
  res.send("I Am Ahshan Habib!");
});

app.listen(port);
