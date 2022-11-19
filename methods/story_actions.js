const mongoose = require("mongoose");
const Story = require("../models/story");
const fs = require("fs");

var functions = {
  addNewStory: (req, res) => {
    modelStory = mongoose.model("Story", Story);
    var newStory = modelStory({
      username: req.body.username,
      bookName: req.body.bookName,
      description: req.body.description, //added this for description addition
      type: req.body.type,
    });
    if (newStory)
      newStory.save(function (err, newStory) {
        if (err) res.json({ success: false, msg: "Failed to save" + err });
        else {
          let filePath =
            "stories/" + req.body.username + "/" + req.body.name + ".json";
          let direcoryPath = "stories/" + req.body.username;
          if (fs.existsSync(direcoryPath))
            fs.writeFile(filePath, "{}", function (err) {
              if (err)
                res.json({
                  success: false,
                  msg: "Failed to save story file in server" + err,
                });
              res.json({ success: true, msg: "Story Saved Successfully" });
            });
          else {
            fs.mkdirSync(direcoryPath);
            fs.writeFile(filePath, "{}", function (err) {
              if (err)
                res.json({
                  success: false,
                  msg: "Failed to save story file in server" + err,
                });
              res.json({ success: true, msg: "Story Saved Successfully" });
            });
          }
        }
      });
  },
  getStories: (req, res) => {
    modelStory = mongoose.model("Story", Story);
    if (req.headers.username)
      modelStory.find(
        { username: req.headers.username },
        function (err, stories) {
          if (err) throw err;
          if (!stories)
            res.status(403).send({ success: false, msg: "Stories not found" });
          else res.status(200).json(stories);
        }
      );
  },
  getPage: (req, res) => {
    if (req.headers.username && req.headers.bookName && req.headers.page) {
      var storyPath =
        "./stories/" +
        req.headers.username +
        "/" +
        req.headers.bookName +
        ".json";
      if (fs.existsSync(storyPath)) {
        fs.readFile(storyPath, "utf8", (err, data) => {
          if (err) throw err;
          obj = JSON.parse(data); //now it an object
          var con = obj[req.headers.page];
          if (!con) res.json({ success: false, content: "not such page" });
          else res.json({ success: true, content: con });
        });
      }
    }
  },
  savePage: (req, res) => {
    if (
      req.body.username &&
      req.body.bookName &&
      req.body.page &&
      req.body.content
    ) {
      var storyPath =
        "./stories/" + req.body.username + "/" + req.body.bookName + ".json";
      if (fs.existsSync(storyPath)) {
        fs.readFile(storyPath, "utf8", function (err, data) {
          if (err) throw err;
          obj = JSON.parse(data); //now it an object
          obj[req.body.page] = req.body.content;
          json = JSON.stringify(obj); //convert it back to json
          fs.writeFile(storyPath, json, "utf8", (err) => {
            if (err) throw err;
            res.json({ success: true, msg: "page saved successfully" });
          });
        });
      }
    } else res.json({ success: false, msg: "book not exists" });
  },
};

module.exports = functions;
