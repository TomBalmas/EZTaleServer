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


module.exports = router;