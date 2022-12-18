const mongoose = require("mongoose");
const Story = require("../models/story");
const fs = require("fs");

var functions = {
  addNewStory: (req, res) => {
    modelStory = mongoose.model("Story", Story);
    var exists = false;
    var newStory = modelStory({
      username: req.body.username,
      bookName: req.body.bookName,
      description: req.body.description, //added this for description addition
      type: req.body.type,
      coWriters: [],
      deadLines: []
    });
    modelStory.findOne(
      {
        // check if book already exists
        username: req.body.username,
        bookName: req.body.bookName,
      },
      (err, book) => {
        if (err) throw err;
        if (book) exists = true;
      }
    );
    if (newStory && !exists)
      newStory.save(function (err, newStory) {
        if (err) res.json({ success: false, msg: "Failed to save" + err });
        else {
          let filePath =
            "./stories/" +
            req.body.username +
            "/" +
            req.body.bookName +
            ".json";
          let direcoryPath = "./stories/" + req.body.username;
          if (fs.existsSync(direcoryPath))
            fs.writeFile(filePath, "{}", function (err) {
              if (err)
                res.json({
                  success: false,
                  msg: "Failed to save story file in server" + err,
                });
              res.json({ success: true, msg: "Story Saved Successfully" });
            });
          else if (!newStory && !exists) {
            fs.mkdirSync(direcoryPath);
            fs.writeFile(filePath, "{}", function (err) {
              if (err)
                res.json({
                  success: false,
                  msg: "Failed to save story file in server" + err,
                });
              res.json({ success: true, msg: "Story Saved Successfully" });
            });
          } else res.json({ success: false, msg: "Story already exists" });
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
    if (req.body.username && req.body.bookName && req.body.page) {
      var storyPath =
        "./stories/" +
        req.body.username +
        "/" +
        req.body.bookName +
        ".json";
      if (fs.existsSync(storyPath)) {
        fs.readFile(storyPath, "utf8", (err, data) => {
          if (err) throw err;
          obj = JSON.parse(data); //now it an object
          var con = obj[req.body.page];
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
  deleteStory: (req, res) => {
    modelStory = mongoose.model("Story", Story);
    if ((req.body.username, req.body.bookName))
      modelStory.deleteOne(
        { username: req.body.username, bookName: req.body.bookName },
        function (err) {
          if (err) throw err;
          else
            res
              .status(200)
              .json({ success: true, msg: "story deleted successfully" });
        }
      );
  },
  restoreStory: (req, res) => {
    var storyPath =
      "./stories/" + req.body.username + "/" + req.body.bookName + ".json";
    if (fs.existsSync(storyPath)) {
      modelStory = mongoose.model("Story", Story);
      var restoredStory = modelStory({
        username: req.body.username,
        bookName: req.body.bookName,
        description: req.body.description, //added this for description addition
        type: req.body.type,
      });
      restoredStory.save(function (err, story) {
        if (err) res.json({ success: false, msg: "Failed to save" + err });
        res.status(200).json({ success: true, msg: "story restored" });
      });
    } else
      res.json({
        success: false,
        msg: "story file not found in server can't restore",
      });
  },
  addCoWriter: (req, res) => {
    modelStory = mongoose.model("Story", Story);
    modelStory.findOne(
      {
        bookName: req.body.bookName,
        username: req.body.username,
        coUsername: req.body.coUsername,
      },
      (err, book) => {
        if (err) throw err;

        book.coWriters.push(req.body.coUsername);
        book.save();
        res.json({
          success: true,
          msg: `coWriter ${req.body.coUsername} added to story ${req.body.bookName}`,
        });
      }
    );
  },
  getCowriters: (req, res) => {
    modelStory = mongoose.model("Story", Story);
    modelStory.findOne(
      {
        bookName: req.headers.bookName,
        username: req.headers.username
      },
      (err, book) => {
        if (err) throw err;
        res.json(book.coWriters);
      }
    );
  },

  addDeadLine: (req, res) => {
    modelStory = mongoose.model("Story", Story);
    modelStory.findOne(
      {
        bookName: req.body.bookName,
        username: req.body.username,
        coUsername: req.body.coUsername,
        deadLine: req.body.deadLine,
      },
      (err, book) => {
        if (err) throw err;
        book.deadLines.push({
          coUsername: req.body.coUsername,
          deadLine: req.body.deadLine,
        });
        res.json({
          success: true,
          msg: `coWriter ${req.body.coUsername} added deadline ${req.body.deadLine}`,
        });
      }
    );
  },
  getDeadLines: (req, res) => {
    modelStory = mongoose.model("Story", Story);
    modelStory.findOne(
      {
        bookName: req.headers.bookName,
        username: req.headers.username
      },
      (err, book) => {
        if (err) throw err;
        res.json(book.deadLines);
      }
    );
  },
  getCoStories: (req, res) => {
    modelStory = mongoose.model("Story", Story);
    var coBooks = [];
    modelStory.find({}, (err, books) => {
      if (err) throw err;
      books.forEach(book => {
        if (book.coWriters != null)
          book.coWriters.forEach(user => {
            if (user == req.headers.username) {
              coBooks.push(book.bookName);
              res.json({ success: true, msg: coBooks });
            }
          });
      });
    });
  }
};

module.exports = functions;
