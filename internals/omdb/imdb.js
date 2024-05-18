const { create: createAxoisInstance } = require('axios');
const { Agent: httpsAgent } = require('https');

const querystring = require('querystring'); 


require('dotenv').config();


module.exports = class  {
    
    static axiosInstance = createAxoisInstance({
        httpsAgent: new httpsAgent({ keepAlive: true }),
        timeout: 1000
    })

    static constructUrl = (baseURL, params) => `${baseURL}?${querystring.stringify(params)}`;
    
    static getByTitle = async ({ title: t }) => {

        try {
            
            const { data } = await this.axiosInstance({
                method: 'GET', // default
                url: this.constructUrl( process.env.OMDB_URL, { t, ApiKey: process.env.API_KEY })
            })
            
            console.log(data);
            
            return data;

        } catch (e) {
            
        }
        
        
    }
    
    static getBySearch = async ( { movie_name: s } ) => {
        try {
            
            const { data } = await this.axiosInstance({
                method: 'GET', // default
                url: this.constructUrl( process.env.OMDB_URL, { s, ApiKey: process.env.API_KEY })
            })
            
            console.log(data);
            
            return data;
        } catch (e) {
            console.log(e)
        }
        
    }
    
    static getByID = async ( imdb_id ) =>  {

        try {
            
            const { data } = await this.axiosInstance({
                method: 'GET', // default
                url: this.constructUrl( process.env.OMDB_URL, { i: imdb_id, ApiKey: process.env.API_KEY })
            })
            
            console.log(data);
            
            return data;

        } catch (e) {
            console.log(e)
        }
    }
    
}
