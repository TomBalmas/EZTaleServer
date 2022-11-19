const mongoose = require("mongoose");
const Story = require("../models/story");
const fs = require("fs");

var functions = {
  addNewStory: (req, res) => {
    modelStory = mongoose.model("Story", Story);
    var newStory = modelStory({
      token: req.body.token, // to know who owns the story
      name: req.body.name,
      description: req.body.description, //added this for description addition
      type: req.body.type,
    });
    if (newStory)
      newStory.save(function (err, newStory) {
        if (err) res.json({ success: false, msg: "Failed to save" + err });
        else {
          let filePath = "stories/" + req.body.name + ".json";
          fs.writeFile(filePath, "{}", function (err) {
            if (err)
              res.json({
                success: false,
                msg: "Failed to save story file in server" + err,
              });
            res.json({ success: true, msg: "Story Saved Successfully" });
          });
        }
      });
  },
  getStories: (req, res) => {
    modelStory = mongoose.model("Story", Story);
    if (req.headers.token)
      modelStory.find({ token: req.headers.token }, function (err, stories) {
        if (err) throw err;
        if (!stories)
          res.status(403).send({ success: false, msg: "Stories not found" });
        else res.status(200).json(stories);
      });
  },
  getStory: (req, res) => {
    if (req.headers.token && req.headers.name) {
      let internalFilePath = "stories/" + req.body.name + ".json";
      let filePath =
        __dirname.replace("methods", "stories\\") + req.headers.name + ".json";
      if (!fs.existsSync(internalFilePath))
        res.status(403).send({ success: false, msg: "Story file not found" });
      else
        res.sendFile(filePath, (err) => {
          if (err) console.log(err);
          else console.log("Sent:", filePath);
        });
    }
  },
  saveStory: (req, res) => {
    if (req.file && req.body.name) {
      //let filePath = 'stories/' + req.body.name + '.ezt';
      //fs.writeFile(filePath, req.file, function(err) {
      res.json({ success: true, msg: "Story Saved Successfully" });
    } //);
  },
  getStoryCount: (req, res) => {
    modelStory = mongoose.model("Story", Story);
    if (req.headers.token) {
      modelStory.find({ token: req.headers.token }).count((err, cnt) => {
        if (err) res.status(403).json({ success: false, count: "Count Error" });
        res.status(200).json({ success: true, count: cnt });
      });
    }
  },
  getPage: (req, res) => {
    if (req.headers.username && req.headers.bookname && req.headers.page) {
      var storyPath = "./stories/" + req.headers.bookname + ".json";
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
      var storyPath = "./stories/" + req.body.bookName + ".json";
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
      } else {
        let obj = {}; //now it an object
        obj[req.body.page] = req.body.content;
        let json = JSON.stringify(obj);
        fs.writeFile(storyPath, json, (err) => {
          if (err) throw err;
          res.json({
            success: true,
            msg: "book created and page saved successfully",
          });
        });
      }
    }
  },
};

module.exports = functions;
