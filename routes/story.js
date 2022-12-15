const express = require("express");
const router = express.Router();
const story_actions = require("../methods/story_actions");
//desc Create new story
//@route POST /story/addNew
//@body username name description type
router.post("/addnew", story_actions.addNewStory);

//desc get all user stories
//@route GET /story/getstories
//@headers username
router.get("/getstories", story_actions.getStories);

//desc saves a page new or old
//@route POST /story/savepage
//@body username page book content
router.post("/savepage", story_actions.savePage);

//desc get page from a book
//@route GET /story/getPage
//@body username page book
router.get("/getpage", story_actions.getPage);

//desc delete story
//@route GET /story/deletestory
//@body book username
router.post("/deletestory", story_actions.deleteStory);

//desc add a coriter to story
//@route GET /story/addCoWriter
//@body book username coUsername
router.post("/addCoWriter", story_actions.addCoWriter);

//desc get the cowriters list
//@route GET /story/getCoWriters
//@body username page book
router.get("/getCoWriters", story_actions.getCowriters);

//desc add deadline to cowriter
//@route GET /story/addDeadline
//@body book username coUsername deadline
router.post("/addDeadline", story_actions.addDeadLine);

//desc get the deadline list
//@route GET /story/getDeadlines
//@body username page book
router.get("/getDeadlines", story_actions.getDeadLines);

module.exports = router;