const express = require('express')
const app = express()

const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 80
const URI = process.env.URI
const DB = process.env.DB
const DATES = process.env.DATES.split(' ')

if (DATES.length) {
  console.log('The following fields will be converted to ISODate objects:')
  for (let key of DATES) {
    console.log('  '+key)
  }
  console.log()
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const { MongoClient } = require("mongodb")
const client = new MongoClient(URI)

const connectDB = async () => {
  try {
    client.db(DB)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error(error)
  }
}

//Connect to the database before listening
connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`)
    })
})

app.post('/event', async (req, res) => {
  let payload = req.body
  res = Store(payload,'events',res)
})

app.post('/traffic', async (req, res) => {
  let payload = req.body
  res = Store(payload,'traffic',res)
})

function Store (payload,collection,res) {
  let isArray = Array.isArray(payload)
  const events = client.db(DB)
    .collection(collection)
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
  return res
}

function stringToDate(keys, doc) {
  for (key of keys) {
    if (key in doc) {
      doc[key] = new Date(doc[key])
    }
  }
  return doc
}
