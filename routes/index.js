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
//@desc Get email for check if exists 
//@route GET /getemail
router.get('/getemail',actions.getEmail);
//@desc Get username for check if exists 
//@route GET /getusername
router.get('/getusername',actions.getUsername);
//@desc Add new entity
//@route POST /entities/addentitiy
router.post('/entities/addentity',actions.addEntity);
//@desc Get Entity
//@route GET /entities/getentitiy
router.get('/entities/getentity',actions.getEntity);

module.exports = router;