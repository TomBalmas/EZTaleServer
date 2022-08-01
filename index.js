const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const port = 3000;
const app = express();

app.use(cors());

mongoose.connect("mongodb://localhost:27017/EZTale",{
    useNewUrlParser: true
}).then(() => {
    app.get('/', (req, res) => {
        res.send('Yes');
        console.log('GET sent');
      });
    app.listen(port, () => {
        console.log(`EZTale server listening on port ${port}`)
    });
}).catch(()=> { 
    console.log("Database connection failed!");
})



