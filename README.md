# jstore

Node.js implementation of a webhook to store POSTed JSON objects in a MongoDB collection.

## Introduction
This webhook can be used with any data source that posts JSON payloads via HTTP.
MongoDB was the logical choice for the backend storage of the captured data since it can store JSON records containing nested objects as is, thus preserving the original structure in MongoDB documents.

## Installation

After cloning the repository, change to your new repo's root folder and invoke:

```bash
npm install
```

## Configuration

The webhook relies on [dotenv](https://www.npmjs.com/package/dotenv) for configuration.

The `DATES` env variable is a space-delimited list of top-level JSON keys that store DateTime (timestamp) information as strings.
By listing them here, the webhook will change them to [Date objects](https://www.mongodb.com/docs/v6.0/reference/method/Date/#return-date-as-date-object) so that MongoDB queries can leverage Date-based functions on these fields.

### Standalone MongoDB Server

```
NODE_ENV = development
PORT = 7654
URI =  'mongodb://my_username:my_password@192.168.0.123:27017/my_database?authSource=my_authentication_database'
DB = my_database
COLLECTION = events
ENDPOINT = event
DATES = 'begin_timestamp end_timestamp'
```
### MongoDB Atlas

Only the URL env variable needs to be changed for connecting to MongoDB Atlas
```
URI = 'mongodb+srv://my_username:my_password@cluster0.cnbvep7.mongodb.net/my_database&authSource=admin&authMechanism=SCRAM-SHA-1&retryWrites=true&w=majority'
```

> **Note**<br />
> Make sure you change `cluster0.cnbvep7.mongodb.net` to the correct hostname for your MongoDB Atlas cluster.

## Usage

```
npm start
```

Upon success you should see:
```
> jstore@1.0.0 start
> node server.js

Server listening on port 7654
```

## Data source configuration

Provide your data source with the appropriate URI.
Based on the configuration example above, it would be:

```
http://192.168.0.123:7654/event
```

## License

`jstore` is released under the MIT license.