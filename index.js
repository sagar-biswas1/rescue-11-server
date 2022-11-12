const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://oshan:uxAbHjV0pSobJ9Wl@cluster0.jys8h.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const notesCollection = client.db("notesTaker").collection("notes");

    app.post("/note", async (req, res) => {
      const data = req.body;
console.log("--->",data)
      const result = await notesCollection.insertOne(data);

      res.send(result);
    });

    app.get("/notes", async (req, res) => {
      const query = req.query; // either {} || { userName: 'oshan' }
     // console.log(query);
      const data = notesCollection.find(query);
      const results = await data.toArray();
      res.send(results);
    });

    app.delete("/note/:id", async (req, res) => {
      const id = req.params.id;
      const result = await notesCollection.deleteOne({ _id: ObjectId(id) });

    //  console.log(result);
      res.send(result);
    });

    app.put("/note/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const data = req.body;
     
      const updateDoc = {
      $set: {
        "userName": data.userName,
        "textData": data.textData
      },
    };

      const result = await notesCollection.updateOne(filter, updateDoc, options);

      res.send(result)
    });
   
    console.log("connected to db");
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
