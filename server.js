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
    app.use(morgan('dev'));
}
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(routes);
app.use(passport.initialize());
require('./config/passport')(passport);

const port = process.env.PORT || 3000;
app.listen(port, console.log(`EZTale server listening in ${process.env.NODE_ENV} mode and port ${port}`));