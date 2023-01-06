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
//@route POST /story/getPage
//@body username page book
router.post("/getpage", story_actions.getPage);

//desc delete story
//@route GET /story/deletestory
//@body book username
router.post("/deletestory", story_actions.deleteStory);

//desc add a co writer to story
//@route GET /story/addCoWriter
//@body book username coUsername
router.post("/addCoWriter", story_actions.addCoWriter);

//desc get the cowriters list
//@route GET /story/getCoWriters
//@body username page book
router.post("/getCoWriters", story_actions.getCowriters);

//desc add deadline to cowriter
//and sends email with calendar
//@route POST /story/addDeadline
//@body bookName username email coUsername deadline(days)
//@body description coUsernameEmail
router.post("/addDeadline", story_actions.addDeadLine);

//desc get the deadline list
//@route POST /story/getDeadlines
//@body username bookName
router.post("/getDeadlines", story_actions.getDeadLines);

//desc get the co stories
//@route POST /story/getCoStories
//@body username
router.post("/getCoStories", story_actions.getCoStories);

//desc saves co writers page
//@route POST /story/saveCowriterPage
//@body username
router.post("/saveCowriterPage", story_actions.saveCowriterPage);

//desc get co writers page
//@route POST /story/getCowriterPage
//@body username
router.post("/getCowriterPage", story_actions.getCowriterPage);

//desc accepting a merge request
//@route POST /story/acceptMergeRequest
//@body username bookName coUsername page
router.post("/acceptMergeRequest", story_actions.acceptMergeRequest);

//desc get pages number of story
//@route POST /story/getnumberofpages
//@body username bookName
router.post("/getnumberofpages", story_actions.getNumberOfPages);

//desc get pages number of story
//@route POST /story/getCowtiternumberofpages
//@body username bookName coUsername
router.post("/getCowtiternumberofpages", story_actions.getCowtiternumberofpages);

//desc accept invitation 
//@route POST /story/acceptInvitationAddBook
//@body inviteCode coUsername
router.post("/acceptInvitationAddBook", story_actions.acceptInvitationAddBook);

//desc add merge request from co writer
//@route POST /story/addMergeRequest
//@body username(owner) bookName coUsername
router.post("/addMergeRequest", story_actions.addMergeRequest);

//desc mark a merge request as unmerged for letting the coWriter make changes
//@route POST /story/markMergeAsUnmerged
//@body username(owner) bookName coUsername
router.post("/markMergeAsUnmerged", story_actions.markMergeAsUnmerged);

//desc get merge requests
//@route POST /story/getMergeRequests
//@body username(owner) bookName
router.post("/getMergeRequests", story_actions.getMergeRequests);

//desc delete merge request
//@route POST /story/deleteMergeRequest
//@body username(owner) bookName coUsername
router.post("/deleteMergeRequest", story_actions.deleteMergeRequest);




module.exports = router;