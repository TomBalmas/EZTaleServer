const express = require("express");
const router = express.Router();
const story_actions = require("../methods/story_actions");
//desc Create new story
//@route POST /story/addNew
//@body token username name description type
router.post("/addnew", story_actions.addNewStory);

//desc get all user stories
//@route GET /story/getstories
//@headers token
router.get("/getstories", story_actions.getStories);

//desc saves a page new or old
//@route POST /story/savepage
//@body token page book content
router.post("/savepage", story_actions.savePage);

//desc get page from a book
//@route GET /story/getPage
//@body token page book
router.get("/getpage", story_actions.getPage);

module.exports = router;