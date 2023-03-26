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
  const payload = req.body
  let isArray = Array.isArray(payload)
  const database = client.db(DB)
  const events = database.collection(COLLECTION)
  try {
    if (isArray) {
      for (let i = 0; i < payload.length; i++) {
        payload[i].timestamp = new Date(payload[i].timestamp)
      }
      events.insertMany(payload)
    } else {
      payload.timestamp = new Date(payload.timestamp)
      events.insertOne(payload)
    }
    res.status(200).send('Data saved to database')
  } catch (error) {
    console.error(error)
    res.status(500).send('Error saving data to database')
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
