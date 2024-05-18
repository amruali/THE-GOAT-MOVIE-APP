const pool = require('./connection');

const { buildWhereClause } = require('./utils')


module.exports = class {

    static addMoviesToDB = async (movies_list) => {
    
        const client = await pool.connect(); 
    
        const stmt = `INSERT INTO "goat-movies".movies  (TITLE, DIRECTOR, "year", LENGTH, COUNTRY, COLOUR, GENRE, "2022", "2023", POS) VALUES ${movies_list.map(movie => [
            movie.Title,
            movie.Director,
            movie.Year,
            movie.Length,
            movie.Country,
            movie.Colour,
            movie.Genre,
            movie["2022"],
            movie["2023"],
            movie.Pos ?? 'DEFAULT'
        ]).map(sublist => `(${sublist.map(value => {
    
    
            if (typeof value === 'string') {
                return value === 'DEFAULT' ? value : `'${value.replace(/'/g, "''")}'`; // Escape single quotes
            }
    
            return value;
    
    
        }).join(', ')})`).join(', ')};`;
    
    
        await client.query(stmt);
    
    
        client.release();
    
    }
    
    static getMovies = async ( filters = {} ) => {
    
    
        // validate type
        if (typeof filters !== 'object' || filters === null || Array.isArray(filters)) {
            throw new Error('Invalid filters object. Expected an object.');
        }
    
        // parse only existing movies table columns
        const movies_table_columns = ["title", "genre", "director", "country", "colour", "year"];
    
        // filter
        const whereClauseFilters = Object.keys(filters).filter( column => movies_table_columns.includes(column)).map(key => {
            return {
                key,
                value: filters[key],
                filterType: key === "title" ? "like" : "="
            }
        } );
        
        // build the where clause
        const { whereClause, values = [] } = buildWhereClause(whereClauseFilters); 
    
        let nextQueryParameterIdx = values.length + 1;
    
        // destruct pageNumber & pageSize & assign default values in case of undefined
        let { page : pageNumber = 1, pageSize = 20 } = filters;
    
        // extra validation before sending query to the database
        pageNumber = Number.isInteger(parseInt(pageNumber)) && parseInt(pageNumber) > 0 ? parseInt(pageNumber)  : 1; // Default to page 1 if page parameter is not provided
        pageSize = Number.isInteger(parseInt(pageSize)) && parseInt(pageSize) ? parseInt(pageSize) : 20; // Default page size to 10 if pageSize parameter is not provided
    
    
        const stmt = `select TITLE,
                        DIRECTOR, 
                        "year",
                        LENGTH,
                        COUNTRY,
                        COLOUR,
                        GENRE,
                        "2022",
                        "2023" 
                    from 
                        "goat-movies".movies 
                    where ${whereClause}
                        AND pos > $${nextQueryParameterIdx++}
                        LIMIT $${nextQueryParameterIdx++}
                    `;
    
        const client = await pool.connect()
    
        const { rowCount: moviesCount, rows: movies } = await client.query({   
            // name: 'fetch-movies',  // providing a name to the prepaid statement will cause an error in case of changing statement
            text: stmt,
            values: [...values, (pageNumber - 1) * pageSize, pageSize]
        });
    
        client.release();
    
        return {
            moviesCount,
            movies
        }
    }
    
    
}