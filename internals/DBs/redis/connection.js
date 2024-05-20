const { createClient } = require('redis');


require('dotenv').config()

const client = createClient({ url: process.env.REDIS_URL});

client.connect();

client.on('error', err => console.log('Redis Client Error', err))
  

module.exports = client;