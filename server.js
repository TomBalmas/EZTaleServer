const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const routes = require('./routes/index');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const { Schema } = mongoose;

connectDB();

const app = express();


if(process.env.NODE_ENV === 'development') { 
    app.use(morgan('dev'))
}
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(routes);
app.use(passport.initialize())
require('./config/passport')(passport)

const port = process.env.PORT || 3000;
app.listen(port, console.log(`EZTale server listening in ${process.env.NODE_ENV} mode and port ${port}`));



// const usersSchema = new Schema({first_name: String, last_name: String } ,{collection:"Users"}) // this is how to use existing collection
// const user = mongoose.model('user', usersSchema); //using a model on a specific collection ======= collection == schema

// app.get('/', (req, res) => {    
//     res.send('Yes');
//     console.log('GET sent');
//   });

// app.route('/register').post((req,res) => {
//     console.log(req);
//     res.send('yes');
// });

//  //create user
//  user.create({ 
//     first_name:"Tom",
//     last_name:"Balmas"
// });


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












