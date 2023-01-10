const express = require("express");
const dotenv = require('dotenv')
const postRoute = require('./routes/post.js')
const path = require('path')
const cors = require('cors')

const app = express();
dotenv.config();

app.use(cors())

app.use('/api', postRoute);


if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "./client/build")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "./client/build/index.html"));
    });
}
    

    
const PORT = process.env.PORT || 50000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})