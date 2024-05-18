const pool = require('./connection')


module.exports = class {
    
    constructor() {}


    static sanitize = ( { type = "string", value = ""} ) => {

        const sanitize_types =  {

            "username": /^[a-zA-Z][a-zA-Z0-9_-]{2,15}$/,
            "password": /^\$2[ayb]\$.{56}$/

        }

        return sanitize_types[type].test(value);
    }

    static getUserByID = async (user_id) => {

        try {

            const poolClient = await pool.connect(); 

            const stmt = ` select id, username, hashed_password from "goat-movies".users where user_id = $1`
            
            const { rows } = await poolClient.query({   
                name: 'get-user-by-id',  // providing a name to the prepaid statement will cause an error in case of changing statement
                text: stmt,
                values: [user_id]
            });

            poolClient.release();

        } catch (err) {

        }
    }

    static getUserByUserName = async (username) => {
        
        try {

            const poolClient = await pool.connect(); 
            
            const stmt = ` select id, username, hashed_password from "goat-movies".users where user_id = $1`
             
            const { rows } = await poolClient.query({   
                name: 'get-user-by-username',  // providing a name to the prepaid statement will cause an error in case of changing statement
                text: stmt,
                values: [username]
            });

            poolClient.release();


        } catch (err) {

        }
    }
    
    static createUser = async ({ username, hashed_password }) => {

        try {

            const poolClient = await pool.connect(); 

            const stmt = `INSERT INTO "goat-movies".users  (username, hashed_password) VALUES ($1, $2)`;
    
            const result = await poolClient.query({ 
                name: 'create-new-user',  // providing a name to the prepaid statement will cause an error in case of changing statement
                text: stmt,
                values: [username, hashed_password]
            });

            poolClient.release();

        } catch (e) {

        }

    }
    
    static updateUserHashPassword = async ( user_id, hashed_password ) => {

        try {

            const poolClient = await pool.connect(); 

            const stmt = `update "goat-movies".users set hashed_password = $1 where id = $2`;
    
            const result = await poolClient.query({ 
                name: 'update-user-hashed-password',  // providing a name to the prepaid statement will cause an error in case of changing statement
                text: stmt,
                values: [hashed_password, user_id]
            });

            poolClient.release();

        } catch (e) {

        }
    }

    static getUserProfileInfo = async ( user_id ) => {

        try {

            const poolClient = await pool.connect(); 

            const stmt = `SELECT 
                    u.id,
                    u.username,
                    m1.title AS favorite_movie,
                    COALESCE(json_agg(json_build_object('id', m2.id, 'title', m2.title)), '[]') AS wishlist
                
                FROM 
                    "goat-movies".users u
                LEFT JOIN 
                    "goat-movies".movies m1 ON u.favorite_movie_id = cast(m1.id as varchar)
                LEFT JOIN 
                    "goat-movies".movies m2 ON m2.id = ANY(string_to_array(u.wishlist, ',')::int[])
                WHERE 
                    u.id = $1
                GROUP BY 
                    u.id, u.username, m1.title;`
    
            const { rows } = await poolClient.query({ 
                name: 'get-user-profile',  // providing a name to the prepaid statement will cause an error in case of changing statement
                text: stmt,
                values: [user_id]
            });

            poolClient.release();
            
            return rows[0];

        } catch (e) {

        }
        

    }

    // static updateUser = () => {}

    static addMoviesToUserWishList = async ( user_id, movies_list = [] ) => {
        
        try {


            const poolClient = await pool.connect(); 

            const stmt = `
            UPDATE "goat-movies".users 
            SET wishlist = CASE
                WHEN wishlist IS NULL THEN $1
                ELSE CONCAT(wishlist, '${movies_list.join(",").length ? "," :  ""  }$1')
              END
            where id = $2`;
    
    
            const result = await poolClient.query({ name: "update-user-wishlist", text: stmt, values: [movies_list.join(","), user_id]})
        
            poolClient.release();

        } catch (e) {

        }

    }

    static markMovieAsUserFavorite = async ( user_id, movie_id ) => {
        try {

            const poolClient = await pool.connect(); 

            const stmt = `update "goat-movies.users set favorite_movie_id = $1 WHERE id = $2"`;
            const result = await poolClient.query({ name: "mark-movie-as-favotite", text: stmt, values: [movie_id, user_id]})
        
            poolClient.release();

        } catch (e) {

        }

    }
    
    static deleteUser = (user_id) => {}


}