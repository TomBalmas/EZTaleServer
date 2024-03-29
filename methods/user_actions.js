var User = require("../models/user");
var jwt = require("jwt-simple");
var config = require("../config/dbconfig");
var email_sender = require("./email_sender");

var functions = {
  addNewUser: function (req, res) {
    if (
      !req.body.name ||
      !req.body.surname ||
      !req.body.username ||
      !req.body.password ||
      !req.body.email
    ) {
      res.json({ success: false, msg: "Enter all fields" });
    } else {
      var newUser = User({
        name: req.body.name,
        surname: req.body.surname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });
      newUser.save(function (err, newUser) {
        if (err) res.json({ success: false, msg: "Failed to save" });
        else {
          email_sender.sendHelloMsg(req, res);
          res.json({ success: true, msg: "Successfully saved" });
        }
      });
    }
  },
  //auth with user and email
  authenticate: function (req, res) {
    if (!req.body.username && req.body.email)
      User.findOne(
        {
          email: req.body.email,
        },
        function (err, user) {
          if (err) throw err;
          if (!user)
            res
              .status(403)
              .send({ success: false, msg: "Auth Failed, User not found" });
          else {
            user.comparePassword(req.body.password, function (err, isMatch) {
              if (isMatch && !err) {
                var token = jwt.encode(user, config.secret);
                res.json({
                  success: true,
                  token: token,
                  username: user.username,
                });
              } else {
                res
                  .status(403)
                  .send({ success: false, msg: "Auth Failed, Wrong password" });
              }
            });
          }
        }
      );
    else if (req.body.username && !req.body.email)
      User.findOne(
        {
          username: req.body.username,
        },
        function (err, user) {
          if (err) throw err;
          if (!user)
            res
              .status(403)
              .send({ success: false, msg: "Auth Failed, User not found" });
          else {
            user.comparePassword(req.body.password, function (err, isMatch) {
              if (isMatch && !err) {
                var token = jwt.encode(user, config.secret);
                res.json({
                  success: true,
                  token: token,
                  username: user.username,
                });
              } else {
                res
                  .status(403)
                  .send({ success: false, msg: "Auth Failed, Wrong password" });
              }
            });
          }
        }
      );
    else
      res
        .status(404)
        .json({ success: false, msg: "Auth Failed something went wrong" });
  },
  getInfo: function (req, res) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      var token = req.headers.authorization.split(" ")[1];
      var decodedToken = jwt.decode(token, config.secret);
      res.json({
        success: true,
        name: decodedToken.name,
        surname: decodedToken.surname,
        username: decodedToken.username,
        email: decodedToken.email,
      });
    } else {
      res.json({ success: false, msg: "No Headers" });
    }
  },
  getEmail: function (req, res) {
    if (req.headers.email) {
      User.findOne({ email: req.headers.email }, function (err, user) {
        if (err) throw err;
        if (user) {
          res
            .status(200)
            .json({ success: true, msg: "Email Found: " + user.email });
        } else res.status(404).json({ success: true, msg: "Email Not Found" });
      });
    } else return res.json({ success: false, msg: "No Headers" });
  },

  getUserByEmail: (req, res) => {
    if (req.body.email) {
      User.findOne({ email: req.body.email }, function (err, user) {
        if (err) throw err;
        if (user) {
          res.status(200).json({ success: true, username: user.username });
        } else res.status(404).json({ success: true, msg: "Email Not Found" });
      });
    } else return res.json({ success: false, msg: "No Headers" });
  },

  getUsername: function (req, res) {
    if (req.headers.username) {
      User.findOne({ username: req.headers.username }, function (err, user) {
        if (err) throw err;
        if (user)
          res
            .status(200)
            .json({ success: true, msg: "UserName Found: " + user.username });
        else res.status(404).json({ success: true, msg: "UserName Not Found" });
      });
    } else res.json({ success: false, msg: "No Headers" });
  },

  changeUserSettings: (req, res) => {
    //TEST!
    if (req.body.username) {
      var updatedUser = req.body;
      try {
        User.UpdateOne({ username: req.body.username }, updatedUser);
        res.json({ success: true, msg: "User has been upadted" });
      } catch {
        res.json({ success: false, msg: "Update user error" });
      }
    }
  },

  deleteUser: (req, res) => {
    if (req.body.username && req.body.token) {
      try {
        User.deleteOne(
          { username: req.body.username, token: req.body.token },
          function (err) {
            if (err) throw err;
            else
              res
                .status(200)
                .json({ success: true, msg: "User has been deleted" });
          }
        );
      } catch {
        res.json({ success: false, msg: "Delete user error" });
      }
    }
  },
  getEmailByUsername: (req, res) => {
    if (req.body.username) {
      User.findOne({ username: req.body.username }, function (err, user) {
        if (err) throw err;
        if (user) res.status(200).json({ success: true, msg: user.email });
        else res.status(404).json({ success: true, msg: "UserName Not Found" });
      });
    } else res.json({ success: false, msg: "No Body" });
  },
};

module.exports = functions;
