# THE GOAT OF MOVIES APP

## Current Running Link | Version

https://the-goat-movie-app.onrender.com/

## Used Packages

[pg@8.0](https://node-postgres.com/)

[redis@4.6.14](https://www.npmjs.com/package/redis)

[hapi.js](https://hapi.dev/)

## Tables

### Moveis

| Title        | Director       | Year | Length | Country | Colour | Genre      | 2022 | 2023 | Pos | ID  | IMDB ID    | Poster     |
|--------------|----------------|------|--------|---------|--------|------------|------|------|-----|-----|------------|------------|
| Inception    | Christopher Nolan | 2010 | 148 min | USA     | Color  | Sci-Fi     | 9.5  | 9.7  | 1   | 123 | tt1375666  | https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg |
| Parasite     | Bong Joon Ho   | 2019 | 132 min | South Korea | Color | Thriller   | 9.3  | 9.6  | 2   | 124 | tt6751668  | 

### Users

| id | username | hashed_password | favorite_movie_id | wishlist |
|----|----------|-----------------|-------------------|----------|
|  1 | amrali   | amrali          | 20                | 44, 45   |


## Blocks of code  | CONNECTION POOLING


```
const { Pool } = require('pg')
require('dotenv').config();


const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    max: process.env.DB_MAX_CONNECTIONS,
    idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT,
    connectionTimeoutMillis: process.env.DB_CONNECTION_TIMEOUT
});


pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});


module.exports = pool;
```


## Requests

#### 1. List Movies (Pagination Supported!) 
    => GET {{baseURL}}/api/v1/movies?page=2&pageSize=10

#### 2. User Profile 
    => GET {{baseURL}}/api/v1/user/profile/1

#### 3. IMDB Movie By IMDB-ID
    => GET {{baseURL}}/api/v1/movies/imdb/tt21276878



## Run Locally Using Docker compose 


```sh

$ cd deployments

## For The First Time to migrate the database run command

$ sh deploy sh

## In Case of your database already migrated You only need to

$ docker compose up -d
