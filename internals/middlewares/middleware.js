
const cashing = require('../DBs/redis/index');


const isCashed = async (request, h) => {

    const { cashType = "list" } = request.app;

    const { pathname, search} = request.url;

    const { page: pageNumber = 1, pageSize = 20 } = request.query ?? {}

    const start = (pageNumber - 1) * pageSize;

    const end = start + pageSize - 1;

    const movies_list = await cashing.getFromList(pathname + search, start, end);

    try {

        if (movies_list && Array.isArray(movies_list) && movies_list.length > 0 ) {

            return h.response({ moviesCount : movies_list.length, movies: movies_list.map( movie => JSON.parse(movie)) }).takeover();

        }

        return h.continue;

    } catch (e) {

        return h.continue;

    }

}
  

module.exports = {
    isCashed
}