const fs = require('fs')
const csv = require('csvtojson');
const path = require('path')
const { Parser } = require('json2csv');


//GET DIRECTORY OF THE FILE
const readdir = (dirname) => {
    return new Promise((resolve, reject) => {
      fs.readdir(dirname, (error, filenames) => {
        if (error) {
          reject(error);
        } else {
          resolve({filenames: filenames, dirname: dirname});
        }
      });
    });
};



//READ CONTENTS FROM THE CSV FILE
async function readFileContents (res) {
  try {
    const filenames = res.filenames;
    const csvDir = res.dirname;

    let csvData = {}
    if (filenames) {
      for (let i = 0; i < filenames.length; i++) {
  
          let currentFilePath = csvDir + filenames[i]
          // console.log(currentFilePath)
  
          csv({delimiter: ";"})
              .fromFile(currentFilePath)
              .then((jsonObj) => {
                    let objName = path.parse(filenames[i]).name; 
                    csvData[objName] = jsonObj;
                    // console.log(csvData)
              })
  
          await csv().fromFile(currentFilePath)
      }
    }
    // console.log(csvData)
    return csvData;

    } catch (error) {
      console.log(error);
      res.status(400)
  }
   
  }


//GENERATE CSV FILE
const generateCSV = async (rows) => {
    try {
      const jsonToCsv = new Parser();
      const csv = jsonToCsv.parse(rows)
  
       fs.writeFile('info.csv', csv, function (err) {
          if (err) {
            throw err
          } 
       })

      return csv;

    } catch (error) {
      throw error;
    }
}



//CREATE CSV DATA
const createItemsList = async (contents) => {

  const libraryContent = [];

  if (contents) {
    let authors = contents["Authors"];
    let books = contents["Books"];
    let magazines = contents["Magazines"];

    for (let i = 0; i < authors.length; i++) {
        let authorEmail = authors[i]["email"];
       
        for (let a = 0; a < books.length; a++) {
            var contentObj = {}
            if (books[a].authors.includes(authorEmail)) {
                contentObj.name = `${authors[i].firstname} ${authors[i].lastname}`;
                contentObj.email = authorEmail
                contentObj.title = books[a].title;
                contentObj.bookIsbn = books[a].isbn
                contentObj.bookDesc = books[a].description
                contentObj.publishedAt = ""
                libraryContent.push(contentObj);
            } 
        }

        for (let b = 0; b < magazines.length; b++) {
            var contentObj = {}
            if (magazines[b].authors.includes(authorEmail)) {
                contentObj.name = `${authors[i].firstname} ${authors[i].lastname}`;
                contentObj.email = authorEmail
                contentObj.title = magazines[b].title;
                contentObj.bookIsbn = magazines[b].isbn
                contentObj.bookDesc = magazines[b].description
                contentObj.publishedAt = magazines[b].publishedAt

                libraryContent.push(contentObj);
            } 
        }
    }

    return libraryContent;
  }
}


module.exports = {
    readdir, readFileContents, generateCSV, createItemsList
}