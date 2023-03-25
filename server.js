const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { MongoClient } = require("mongodb");
const uri = 'mongodb://emnify:LTem11060@192.168.0.173:27017/emnify?authSource=emnify';;
const client = new MongoClient(uri);

app.post('/api/mydata', async (req, res) => {
  const doc = req.body;
  const database = client.db('emnify');
  const events = database.collection('events');
  try {
    events.insertOne(doc);
    res.status(200).send('Data saved to database')
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving data to database');
  }
});

const PORT = process.env.PORT || 7123;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
