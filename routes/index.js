const express = require("express");
const user_actions = require("../methods/user_actions");
const router = express.Router();
const entitiesRoute = require("./entity.js");
const storyRoute = require("./story.js");

router.use("/entity", entitiesRoute);
router.use("/story", storyRoute);

router.get("/", (req, res) => {
  res.status(200).send("Connected!");
});

//@desc Adding new user
//@route POST /adduser
//@body name, surname, username, email, password(as hash)
router.post("/adduser", user_actions.addNewUser);

//@desc Authenticate user
//@route POST /auth
//@body username, password
router.post("/auth", user_actions.authenticate);

//@desc Get user info
//@route GET /getinfo
//@headers "Bearer" + token
router.get("/getinfo", user_actions.getInfo);

//@desc Get email for check if exists
//@route GET /getemail
//@headers email
router.get("/getemail", user_actions.getEmail);

//@desc Get username for check if exists
//@route GET /getusername
//@headers username
router.get("/getusername", user_actions.getUsername);

//@desc change username properties
//@route POST /updateuser
//@body username + every user property
router.post("/updateuser", user_actions.getUsername);


module.exports = router;
