const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const port = 3000;
const { Schema } = mongoose;
const app = express();

app.use(cors());
const uri = "mongodb+srv://root2:1234@maincluster.eegqfie.mongodb.net/EZTale";

//connection to DB
async function connectToMongo() {
    await mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true});
    console.log("Database connected successfully ")
}
connectToMongo().catch(err => console.log(err)).then(() => {
    app.listen(port, () => { //listening on port
        console.log(`EZTale server listening on port ${port}`)
    });
});


const usersSchema = new Schema({first_name: String, last_name: String } ,{collection:"Users"}) // this is how to use existing collection
const user = mongoose.model('user', usersSchema); //using a model on a specific collection ======= collection == schema

app.get('/', (req, res) => {    
    res.send('Yes');
    console.log('GET sent');
  });

app.route('/register').post((req,res) => {
    console.log(req);
    res.send('yes');
});

 //create user
 user.create({ 
    first_name:"Tom",
    last_name:"Balmas"
});


//testSchema.add({gender:String}); //add field to schema 
// testSchema.remove({gender:String}); //remove field to schema

// user.deleteOne({ first_name: 'Bohad' }, (err) => { //delete user
//     if (err) return handleError(err);
    
//   });

//user.updateOne({ first_name: 'Bom' }, { first_name: 'Tom' }, (err, res)=> { //update user
// Updated at most one doc, `res.nModified` contains the number
// of docs that MongoDB updated
//});

//an example of getting data and import it to an array
// users = []
// user.find({ first_name: "Tom" }) 
// .then(data => {
//     console.log("Database users:")
//     console.log(data);
//     data.map((d, k) => {
//         users.push(d._id);
//     })
//     users.forEach( (i) => { 
//         console.log(i);
//     });
// })
// .catch(error => {
//     console.log(error);
// })












