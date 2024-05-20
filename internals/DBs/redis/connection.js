const { createClient } = require('redis');


// require('dotenv').config()

const client = createClient({url: 'redis://redis:6379'});


client.connect();


client.on("connect", ()=> console.log("HELO"));

client.on('error', err => console.log('Redis Client Error', err));


module.exports = client;