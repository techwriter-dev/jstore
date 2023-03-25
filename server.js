const express = require('express')
const app = express()

const dotenv = require('dotenv').config()
const PORT = process.env.PORT
const URI = process.env.URI
const DB = process.env.DB
const COLLECTION = process.env.COLLECTION

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const { MongoClient } = require("mongodb")
const client = new MongoClient(URI)

app.post('/event', async (req, res) => {
  const doc = req.body
  const database = client.db(DB)
  const events = database.collection(COLLECTION)
  try {
    events.insertOne(doc)
    res.status(200).send('Data saved to database')
  } catch (error) {
    console.error(error)
    res.status(500).send('Error saving data to database')
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
