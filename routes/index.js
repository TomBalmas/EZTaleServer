const express = require('express');
const actions = require('../methods/actions');
const router = express.Router();

router.get('/', (req,res) => {
    res.send('Hello World');
})

router.get('/home', (req,res) => {
    res.send('Home');
})

//@desc Adding new user 
//@route POST /adduser 
router.post('/adduser', actions.addNew);
//@desc Authenticate user
//@route POST /auth
router.post('/auth', actions.authenticate);
//@desc Get user info
//@route GET /getinfo
router.get('/getinfo',actions.getInfo);
//@desc Add new entity
//@route POST /entites/addentitiy
router.post('/entites/addentity',actions.addEntity);

module.exports = router;