const fs = require('fs');
const path = require('path');

module.exports = {
    getData: () => {
        return new Promise((resolve, reject) => {
            var dataPath = path.join(__dirname + '/data') + '/data.json';
            fs.readFile(dataPath, 'utf-8', (err, data) => {
                if(err) reject(err)
                resolve(data);
            })
        })
    }
}