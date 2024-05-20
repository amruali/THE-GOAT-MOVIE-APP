// external npm packages
const Boom = require('@hapi/boom');

// node modules
const fs = require('fs');
const Path = require('path');

// project modules
const moviesRepo = require('../DBs/postgres/moviesRepo');
const imdb = require('../omdb/imdb');

const cashing = require('../DBs/redis/index')



const { processReadFile: readFile } = require('../../utils')

module.exports = class {

    static getMoviesHandler = async (request, h) => { 
        try {
            
            const { pathname, search } = request.url;

            const result = await moviesRepo.getMovies(request.query ?? {});

            if (result.moviesCount && result.moviesCount > 0 ) await cashing.saveList( pathname + search, result.movies.map( movie => JSON.stringify(movie)))

            return result;

        } catch (err) {
            return h.response({ error: 'Internal Server Error' }).code(500);
        }
    }

    static getIMDBMovieByID = async (request, h) => {

        try {

            const imdb_id = request.params.imdb_id;

            if(!(/^tt\d{7,9}$/.test(imdb_id))) throw "Invalid imdb_id"



            return await imdb.getByID(imdb_id);


        } catch (e) {

            return h.response({ error: e }).code(400);

        }
    }

    static uploadMoviesFromCSV = async (request, h) => {

        const file = request.payload.file;

        if (!file || file.hapi.filename.split('.').pop() !== 'csv') {
            throw Boom.badRequest('Invalid file format. Please upload an Excel file (csv).');
        }

        const filename = Path.basename(file.hapi.filename);
        
        const uploadDir = Path.join(__dirname, 'uploads');

        const path = Path.join(uploadDir, filename);

        // Ensure upload directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        await file.pipe(fs.createWriteStream(path));

        const movies = await readFile(path);
        

        try {
            
            await moviesRepo.addMoviesToDB(movies)

            // remove upload directory once the db insertion process is done
            fs.rmSync(uploadDir, { recursive: true, force: true });

            return { message: 'File uploaded successfully' };

        } catch (err) {

            return Boom.conflict(err.detail);

        }

    }
}