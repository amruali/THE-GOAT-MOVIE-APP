const fs = require('fs');
const csv = require('csv-parser');


const trimObjectKeyStringValues = (item) => Object.keys(item).reduce((trimmedData, key) => {
    trimmedData[key] = typeof item[key] === 'string' ? item[key].trim() : item[key];
    return trimmedData;
}, {});


const processReadFile = (path) => new Promise( resolve => {
    
    const movies = [];

    fs.createReadStream(path)
    .pipe(csv())
    .on('data', (data) => movies.push(trimObjectKeyStringValues(data)))
    .on('end', async () => {
        resolve(movies)
    });
})


module.exports = { processReadFile }