const mongoose = require("mongoose");
const Story = require("../models/story");
const email_sender = require("./email_sender");
const fs = require("fs");
var randomstring = require("randomstring");
var moment = require("moment");

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
      deadLines: [],
      merges: [],
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
          if (!fs.existsSync(direcoryPath)) fs.mkdirSync(direcoryPath);
          if (fs.existsSync(direcoryPath))
            fs.writeFile(filePath, '{"1":""}', function (err) {
              if (err)
                res.json({
                  success: false,
                  msg: "Failed to save story file in server" + err,
                });
              res.json({ success: true, msg: "Story Saved Successfully" });
            });
          else if (!newStory && !exists) {
            fs.mkdirSync(direcoryPath);
            fs.writeFile(filePath, '{"1":""}', function (err) {
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
        "./stories/" + req.body.username + "/" + req.body.bookName + ".json";
      if (fs.existsSync(storyPath)) {
        fs.readFile(storyPath, "utf8", (err, data) => {
          if (err) throw err;
          obj = JSON.parse(data); //now it an object
          var con = obj[req.body.page];
          if (!con) res.json({ success: false, content: " " });
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
    //TEST!
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
    //working
    modelStory = mongoose.model("Story", Story);
    var code = randomstring.generate(16);
    modelStory.findOne(
      {
        bookName: req.body.bookName,
        username: req.body.username,
        coUsername: req.body.coUsername,
        coUserEmail: req.body.coUserEmail,
      },
      (err, book) => {
        if (err) throw err;
        book.coWriters.push({
          username: req.body.coUsername,
          email: req.body.coUserEmail,
          inviteCode: code,
          accepted: false,
        });
        email_sender.sendCoWriterInvite(
          code,
          req.body.coUserEmail,
          req.body.username,
          req.body.bookName,
          req.body.coUsername
        );
        let filePath =
          "./stories/" +
          req.body.username +
          "/" +
          req.body.bookName +
          "_" +
          req.body.coUsername +
          ".json";
        let direcoryPath = "./stories/" + req.body.username;
        if (fs.existsSync(direcoryPath))
          fs.writeFile(filePath, '{"1":""}', function (err) {
            if (err)
              res.json({
                success: false,
                msg: "Failed to save cowriter story file in server" + err,
              });
          });
        else res.json({ success: false, msg: "Story Directory not exists!" });
        book.save();
        res.json({
          success: true,
          msg: `coWriter ${req.body.coUsername} added to story ${req.body.bookName} with code ${code}`,
          code: code,
        });
      }
    );
  },
  getCowriters: (req, res) => {
    //TEST!
    modelStory = mongoose.model("Story", Story);
    modelStory.findOne(
      {
        bookName: req.body.bookName,
        username: req.body.username,
      },
      (err, book) => {
        if (err) throw err;
        res.json(book.coWriters);
      }
    );
  },
  addDeadLine: (req, res) => {
    //TEST!
    modelStory = mongoose.model("Story", Story);
    if (
      req.body.bookName &&
      req.body.username &&
      req.body.email &&
      req.body.coUsername &&
      req.body.coUsernameEmail &&
      req.body.deadLine &&
      req.body.description
    ) {
      modelStory.findOne(
        {
          bookName: req.body.bookName,
          username: req.body.username,
          coUsername: req.body.coUsername,
          requested: false,
        },
        (err, book) => {
          if (err) throw err;
          book.deadLines.push({
            coUsername: req.body.coUsername,
            deadLine: moment()
              .add(parseInt(req.body.deadLine), "days")
              .format("DD/MM/YYYY")
              .toString(),
            description: req.body.description,
          });
          book.save();
          //sending the mail with the calandar object
          email_sender.sendDueCalendar(req, res);
          res.json({
            success: true,
            msg: `coWriter ${req.body.coUsername} added deadline ${req.body.deadLine}`,
          });
        }
      );
    }
  },
  getDeadLines: (req, res) => {
    //TEST!
    modelStory = mongoose.model("Story", Story);
    modelStory.findOne(
      {
        bookName: req.body.bookName,
        username: req.body.username,
      },
      (err, book) => {
        if (err) throw err;
        res.json(book.deadLines);
      }
    );
  },
  getCoWriterDeadlines: (req, res) => {
    //TEST!
    modelStory = mongoose.model("Story", Story);
    var deadLines = [];
    modelStory.find({}, (err, books) => {
      if (err) throw err;
      books.forEach((book) => {
        if (book.deadLines != null)
          book.deadLines.forEach((deadLine) => {
            if (deadLine == req.headers.username) {
              deadLines.push({ book: book.bookName, deadLine: deadLine });
              res.json({ success: true, msg: deadLines });
            }
          });
      });
    });
  },
  getCoStories: (req, res) => {
    modelStory = mongoose.model("Story", Story);
    var coBooks = [];
    modelStory.find({}, (err, books) => {
      if (err) throw err;
      books.forEach((book) => {
        if (book.coWriters != null)
          book.coWriters.forEach((user) => {
            if (
              user != null &&
              user.username == req.body.username &&
              user.accepted == true
            )
              coBooks.push(book);
          });
      });
      if (coBooks != []) res.json({ success: true, msg: coBooks });
      else res.json({ success: false, msg: "no Co-books found!" });
    });
  },
  saveCowriterPage: (req, res) => {
    //TEST!
    if (
      req.body.username &&
      req.body.bookName &&
      req.body.page &&
      req.body.coUsername &&
      req.body.content
    ) {
      var storyPath =
        "./stories/" +
        req.body.username +
        "/" +
        req.body.bookName +
        "_" +
        req.body.coUsername +
        ".json";
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
  getCowriterPage: (req, res) => {
    //TEST!
    if (
      req.body.username &&
      req.body.bookName &&
      req.body.coUsername &&
      req.body.page
    ) {
      var storyPath =
        "./stories/" +
        req.body.username +
        "/" +
        req.body.bookName +
        "_" +
        req.body.coUsername +
        ".json";
      if (fs.existsSync(storyPath)) {
        fs.readFile(storyPath, "utf8", (err, data) => {
          if (err) throw err;
          obj = JSON.parse(data); //now it an object
          var con = obj[req.body.page];
          if (!con) res.json({ success: false, content: " " });
          else res.json({ success: true, content: con });
        });
      }
    }
  },
  acceptMergeRequest: (req, res) => {
    modelStory = mongoose.model("Story", Story);
    if (
      req.body.username &&
      req.body.bookName &&
      req.body.coUsername &&
      req.body.page
    ) {
      var storyPath =
        "./stories/" + req.body.username + "/" + req.body.bookName + ".json";
      var mergePath =
        "./stories/" +
        req.body.username +
        "/" +
        req.body.bookName +
        "_" +
        req.body.coUsername +
        ".json";
      var book;
      var mergeBook;
      var newBook = {};
      if (fs.existsSync(storyPath) && fs.existsSync(mergePath)) {
        book = JSON.parse(fs.readFileSync(storyPath));
        mergeBook = JSON.parse(fs.readFileSync(mergePath));
      }
      for (var i = 1; i < parseInt(req.body.page); i++) newBook[i] = book[i];
      var numOfTotalPages =
        Object.keys(book).length + Object.keys(mergeBook).length;
      var continueOldPage =
        Object.keys(mergeBook).length + parseInt(req.body.page);
      for (
        var i = parseInt(req.body.page);
        i < Object.keys(mergeBook).length + parseInt(req.body.page);
        i++
      ) {
        var newPage = i - parseInt(req.body.page) + 1;
        newBook[i] = mergeBook[newPage];
      }
      for (var i = continueOldPage; i <= numOfTotalPages; i++)
        newBook[i] = book[i - Object.keys(mergeBook).length];
      json = JSON.stringify(newBook);

      fs.writeFile(storyPath, json, "utf8", (err) => {
        if (err) throw err;
        modelStory.updateOne(
          {
            'username': req.body.username,
            'bookName': req.body.bookName,
            "merges.coUsername": req.body.coUsername
          },
          { $set: { "merges.$.accepted": true } },
          (error) => {
            if (error)
              res.json({ success: false, msg: "Merge request not found!" });
            else {
              res.json({ success: true, msg: "merge saved successfully" });
            }
          }
        );
      });
    }
  },
  acceptInvitationAddBook: (req, res) => {
    if (req.body.inviteCode && req.body.coUsername) {
      suc = false;
      modelStory = mongoose.model("Story", Story);
      modelStory.updateOne(
        { "coWriters.inviteCode": req.body.inviteCode },
        { $set: { "coWriters.$.accepted": true } },
        (error) => {
          if (error) res.json({ success: false, msg: "Code not found!" });
          else
            res.json({
              success: true,
              msg: "book as been added as co book",
            });
        }
      );
    }
  },
  getNumberOfPages: (req, res) => {
    if (req.body.username && req.body.bookName) {
      var book;
      var storyPath =
        "./stories/" + req.body.username + "/" + req.body.bookName + ".json";
      if (fs.existsSync(storyPath))
        book = JSON.parse(fs.readFileSync(storyPath));
      else res.json({ success: false, msg: "book not found" });
      res.json({ success: true, msg: `${Object.keys(book).length}` });
    }
  },
  getCowtiternumberofpages: (req, res) => {
    if (req.body.username && req.body.bookName && req.body.coUsername) {
      var book;
      var storyPath =
        "./stories/" +
        req.body.username +
        "/" +
        req.body.bookName +
        "_" +
        req.body.coUsername +
        ".json";
      if (fs.existsSync(storyPath))
        book = JSON.parse(fs.readFileSync(storyPath));
      else res.json({ success: false, msg: "book not found" });
      res.json({ success: true, msg: `${Object.keys(book).length}` });
    }
  },
  addMergeRequest: (req, res) => {
    modelStory = mongoose.model("Story", Story);
    if (req.body.username && req.body.bookName && req.body.coUsername) {
      modelStory.findOne(
        {
          bookName: req.body.bookName,
          username: req.body.username,
        },
        (err, book) => {
          if (err) throw err;
          book.merges.push({
            coUsername: req.body.coUsername,
            accepted: false,
          });
          book.save();
          res.json({
            success: true,
            msg: `coWriter ${req.body.coUsername} merge requested to book ${req.body.bookName}`,
          });
        }
      );
    }
  },
  // in case merge not confirmed or the cowriter want to send another request
  markMergeAsUnmerged: (req, res) => {
    if (req.body.coUsername && req.body.username && req.body.bookName) {
      modelStory = mongoose.model("Story", Story);
      modelStory.updateOne(
        {
          suername: req.body.username,
          bookName: req.body.bookName,
          "merges.coUsername": req.body.coUsername
        },
        { $set: { "merges.$.accepted": false } },
        (error) => {
          if (error)
            res.json({ success: false, msg: "Merge request not found!" });
          else res.json({ success: true, msg: "merge unmarked successfully" });
        }
      );
    }
  },
  deleteMergeRequest: (req, res) => {
    modelStory = mongoose.model("Story", Story);
    if (req.body.coUsername && req.body.username && req.body.bookName) {
      modelStory.findOne(
        {
          bookName: req.body.bookName,
          username: req.body.username,
        },
        (err, book) => {
          if (err) throw err;
          const index = book.merges.findIndex((obj) => {
            return (
              obj.coUsername == req.body.coUsername &&
              !obj.accepted
            );
          });
          if (index > -1)
            // only splice array when item is found
            book.merges.splice(index, 1);
          // 2nd parameter means remove one item only
          else {
            res.json({ success: false, msg: "can't find request" });
            return;
          }
          book.save();
          res.json({ success: true, msg: "request deleted" });
        }
      );
    }
  },
  getMergeRequests: (req, res) => {
    modelStory = mongoose.model("Story", Story);
    if (req.body.username && req.body.bookName)
      modelStory.findOne(
        {
          bookName: req.body.bookName,
          username: req.body.username,
        },
        (err, book) => {
          if (err) throw err;
          res.json(book.merges);
        }
      );
  },
  checkMergeAccepted: (req,res) => {
    modelStory = mongoose.model("Story", Story);
    
    if (req.body.username && req.body.bookName && req.body.coUsername)
      modelStory.findOne(
        {
          bookName: req.body.bookName,
          username: req.body.username,
        },
        (err, book) => {
          if (err) throw err;
          var isAccepted = false;
          for(var merge of book.merges )
            if(merge.coUsername == req.body.coUsername )
              isAccepted = true;
          if(isAccepted)
            res.json({success:true, msg:'found'});
            else 
            res.json({success:true, msg:'not found'});
        }
      );
  }
};

module.exports = functions;
