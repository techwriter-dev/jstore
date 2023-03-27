const express = require('express')
const app = express()

const dotenv = require('dotenv').config()
const PORT = process.env.PORT
const URI = process.env.URI
const DB = process.env.DB
const COLLECTION = process.env.COLLECTION
const ENDPOINT = process.env.ENDPOINT
const DATES = process.env.DATES.split(' ')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const { MongoClient } = require("mongodb")
const client = new MongoClient(URI)

app.post('/'+ENDPOINT, async (req, res) => {
  let payload = req.body
  let isArray = Array.isArray(payload)
  const database = client.db(DB)
  const events = database.collection(COLLECTION)
  try {
    let count = 0
    if (isArray) {
      for (let i = 0; i < payload.length; i++) {
        payload[i] = stringToDate(DATES, payload[i])
        count++
      }
      events.insertMany(payload)
    } else {
      payload = stringToDate(DATES, payload)
      events.insertOne(payload)
      count++
    }
    res.status(200).send('Inserted ' + count + ' document(s).')
  } catch (error) {
    console.error(error)
    res.status(500).send('Error inserting document(s)')
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

function stringToDate(keys, doc) {
  for (key of keys) {
    if (key in doc) {
      doc[key] = new Date(doc[key])
    }
  }
  return doc
}