const fs = require('fs');
const path = require('path')
const helper = require('../helper/helper.js')

var csvDir = path.join(process.cwd()) + "/public/"


//GET CONTENTS FROM THE FILES
const getFile = async (req, res) => {
    try {
        const contents = await helper.readdir(csvDir).then((filenames) => helper.readFileContents(filenames))
      
        if (contents) {
            const libraryContent = await helper.createItemsList(contents);

            res.status(200).send(libraryContent)
        }
  
    } catch (error) {
        console.log(error)
        res.status(400)
    }
}



//DOWNLOAD CSV
const downloadCSV = async (req, res) => {
    try {
        const contents = await helper.readdir(csvDir).then((filenames) => helper.readFileContents(filenames));

        if (contents) {
            const libraryContent = await helper.createItemsList(contents);
            var rows = [];

            libraryContent.forEach((item) => {
                var row = {};
                row.name = item.name;
                row.email = item.email
                row.title = item.title;
                row.isbn = item.bookIsbn
                row.description = item.bookDesc;
                row.published = item.publishedAt

                rows.push(row);
            })

            const sortedObj = rows.sort(function(a, b){
                if(a.title < b.title) { return -1; }
                if(a.title > b.title) { return 1; }
                return 0;
            })

            const csvData = await helper.generateCSV(sortedObj);

            res.status(200).send(csvData)
        }

    } catch (error) {
        console.log(error);
        res.status(400)
    }
  
}



module.exports = {getFile, downloadCSV}