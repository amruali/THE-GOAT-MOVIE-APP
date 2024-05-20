'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');

const { setupEndpoints } = require('./internals/transport/rest/endpoints')


require('dotenv').config()

const init = async () => {

    const server = Hapi.server({
        port: process.env.PORT || 8080 ,
        host: '0.0.0.0'
    });

    await server.register(Inert);

    setupEndpoints(server);

    // Error handling
    // server.ext('onPreResponse', (request, h) => {
    //     const response = request.response;
    //     if (response instanceof Error) {
    //         console.error(response);
    //         return Boom.internal('Internal server error');
    //     }
    //     return h.continue;
    // });

    await server.start();

    console.log('Server running on %s', server.info.uri);
};

// process.on('unhandledRejection', (err) => {
//     console.log(err);
//     process.exit(1);
// });

init();