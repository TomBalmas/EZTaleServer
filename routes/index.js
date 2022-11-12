const express = require('express');
const user_actions = require('../methods/user_actions');
const entitiy_actions = require('../methods/entity_actions');
const story_actions = require('../methods/story_actions');
const multer = require('multer');
const router = express.Router();
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './stories');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var upload = multer({ storage: storage });

router.get('/', (req, res) => {
    res.status(200).send('Connected!');
})

//@desc Adding new user 
//@route POST /adduser 
//@body name, surname, username, email, password(as hash)
router.post('/adduser', user_actions.addNewUser);

//@desc Authenticate user
//@route POST /auth
//@body username, password
router.post('/auth', user_actions.authenticate);

//@desc Get user info
//@route GET /getinfo
//@headers "Bearer" + token
router.get('/getinfo',user_actions.getInfo);

//@desc Get email for check if exists 
//@route GET /getemail
//@headers email 
router.get('/getemail',user_actions.getEmail);

//@desc Get username for check if exists 
//@route GET /getusername
//@headers username 
router.get('/getusername',user_actions.getUsername);

//@desc Add new entity
//@route POST /entities/addentitiy
//@body (forAll: type, book, picture, name, relations)
// everything else depend on which type 
router.post('/entities/addentity',entitiy_actions.addEntity);

//@desc Get Entity
//@route GET /entities/getentitiy
//@headers name, book
router.get('/entities/getentity',entitiy_actions.getEntity);

//@desc Get All Book entities
//@route GET /entities/getall
//@headers book
router.get('/entities/getall',entitiy_actions.getAllEntities);

//desc Get All Book user defined entities
//@route GET /entities/getalluserdefined
//@headers book
router.get('/entities/getalluserdefined',entitiy_actions.getAllUserDefinedEntities);

//desc Create new story
//@route POST /story/addNew
//@body token name description type 
router.post('/story/addnew', story_actions.addNewStory);

//desc get all user stories
//@route GET /story/getstories
//@headers token
router.get('/story/getstories', story_actions.getStories);

//desc get all user stories
//@route GET /story/getstory
//@headers token name
router.get('/story/getstory', story_actions.getStory);

//desc Saves a story after editing by writer (overwrite)
//@route POST /story/saveStory
//@body name 
//@file storyFile
router.post('/story/savestory', upload.single('statement'), story_actions.saveStory);

//desc Saves a story after editing by writer (overwrite)
//@route GET /story/getstorycount
//@headers token 
router.get('/story/getstorycount', story_actions.getStoryCount);


module.exports = router;