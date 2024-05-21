const Path = require('path')


// handlers
const MoviesHandlers = require('../../handlers/movies');
const UserHandlers = require('../../handlers/users');

// middlewares
const { isCashed } = require('../../middlewares/middleware')

const setupEndpoints = ( server ) => {


    // Route to serve the Welcome Page
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return h.file(Path.join(__dirname, '../../../public', 'index.html'));
        }
    });
    

    server.route({
        method: 'GET',
        path: '/helloworld',
        options: {
            // ext: {
            //   onPreHandler: {
            //     method: isCashed
            //   }
            // },
            // pre: [{ method: isCashed }],
            handler: (request, h) => {
              return 'Hello, world!';
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/upload',
        options: {
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                multipart: true,
                maxBytes: 1024 * 1024 * 5, // 5MB limit
            }
        },
        handler: MoviesHandlers.uploadMoviesFromCSV        
    });

    server.route({
        method: 'GET',
        path: '/api/v1/movies',
        options: {
            pre: [  
                {
                    method: (request, h) => {
                        request.app.cashType = "list";
                        return h.continue;
                    },
                    // assign: 'defaultCashType'
                },
                { 
                    method: isCashed
                }
            ],
            handler: MoviesHandlers.getMoviesHandler
        }
        
        // handler: MoviesHandlers.getMoviesHandler
    });

    server.route({
        method: 'GET',
        path: '/api/v1/movies/imdb/{imdb_id}',
        handler: MoviesHandlers.getIMDBMovieByID
    });

    server.route({
        method: 'GET',
        path: '/api/v1/user/profile/{user_id}',
        handler: UserHandlers.getUserProfileInfo
    });

}

module.exports = { setupEndpoints }