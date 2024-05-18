const client = require('./connection')


module.exports = class {

    
    static getFromList = async ( list_name, start = 0, end = -1) => {
        return await client.lRange(list_name, start, end);
    } 


    static saveList = async (list_name, values) => {
        await client.sendCommand(["rpush", list_name, ...values]);
    }


}
