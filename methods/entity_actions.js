const mongoose = require("mongoose");
const Entity = require("../models/entity");

var functions = {
  addEntity: function (req, res) {
    modelEntity = mongoose.model("Entity", Entity);
    // character,
    // location,
    // conversation,
    // storyEvent,
    // userDefined,
    // atrributeTemplate,
    switch (req.body.type) {
      case "character":
        Entity.add({
          surename: {
            type: String,
            required: false,
          },
          personalityTraits: {
            type: String,
            required: false,
          },
          appearanceTraits: {
            type: String,
            required: false,
          },
          age: {
            type: Number,
            required: false,
          },
          gender: {
            type: String,
            required: false,
          },
        });
        var newEntity = modelEntity({
          username: req.body.username,
          bookName: req.body.bookName,
          type: req.body.type,
          name: req.body.name,
          relations: req.body.relations,
          surename: req.body.surename,
          personalityTraits: req.body.personalityTraits,
          appearanceTraits: req.body.appearanceTraits,
          age: req.body.age,
          gender: req.body.gender,
        });
        break;
      case "location":
        Entity.add({
          vista: {
            type: String,
            required: false,
          },
        });
        var newEntity = modelEntity({
          username: req.body.username,
          bookName: req.body.bookName,
          type: req.body.type,
          name: req.body.name,
          relations: req.body.relations,
          vista: req.body.vista,
        });
        break;
      case "conversation":
        Entity.add({
          participants: {
            type: Array,
            required: false, //TODO: change to true when adding participant selection
          },
        });
        var newEntity = modelEntity({
          username: req.body.username,
          bookName: req.body.bookName,
          type: req.body.type,
          name: req.body.name,
          relations: req.body.relations,
          participants: req.body.participants,
        });
        break;
      case "storyEvent":
        Entity.add({
          desc: {
            type: String,
            required: false,
          },
        });
        var newEntity = modelEntity({
          username: req.body.username,
          bookName: req.body.bookName,
          type: req.body.type,
          name: req.body.name,
          relations: req.body.relations,
          desc: req.body.desc,
        });
        break;
      case "attributeTemplate":
        Entity.add({
          attributes: {
            type: String,
            required: false,
          },
        });
        var newEntity = modelEntity({
          username: req.body.username,
          bookName: req.body.bookName,
          type: req.body.type,
          name: req.body.name,
          relations: req.body.relations,
          attributes: req.body.attributes,
        });
        break;
      case "userDefined":
        var atrrs = req.body.attributes.split("|"); // spell | power | cheat | look
        atrrs.forEach((atr) => {
          Entity.add({
            [atr]: {
              type: String,
              required: false,
            },
          });
        });
        var vals = req.body.values.split("|");
        var userDef = new Map([
          ["username", req.body.username],
          ["bookName", req.body.bookName],
          ["type", req.body.type],
          ["name", req.body.name],
          ["relations", req.body.relations],
        ]);
        for (var i = 0; i < atrrs.length; i++) userDef.set(atrrs[i], vals[i]);
        var newEntity = modelEntity(Object.fromEntries(userDef));
    }
    if (newEntity)
      newEntity.save(function (err, newEntity) {
        if (err) res.json({ success: false, msg: "Failed to save" + err });
        else res.json({ success: true, msg: "Successfully saved" });
      });
    else res.json({ success: false, msg: "Failed to save no entity created" });
  },
  getEntity: (req, res) => {
    modelEntity = mongoose.model("Entity", Entity);
    if (req.headers.name && req.headers.bookName && req.headers.username)
      modelEntity.findOne(
        {
          bookName: req.headers.bookName,
          username: req.headers.username,
          name: req.headers.name,
        },
        function (err, ent) {
          if (err) throw err;
          if (!ent)
            res.status(403).send({ success: false, msg: "Entity not found" });
          else res.json(ent);
        }
      );
  },
  getAllEntities: (req, res) => {
    modelEntity = mongoose.model("Entity", Entity);
    if (req.headers.bookName && req.headers.username)
      modelEntity.find(
        { book: req.headers.bookName, username: req.headers.username },
        function (err, entArr) {
          if (entArr) throw err;
          if (!entArr)
            res.status(403).send({ success: false, msg: "Entities not found" });
          else res.json(entArr);
        }
      );
  },
  getAllTypeEntities: (req, res) => {
    modelEntity = mongoose.model("Entity", Entity);
    if (req.headers.bookName && req.headers.username && req.headers.type)
      modelEntity.find(
        {
          username: req.headers.username,
          bookName: req.headers.bookName,
          type: req.headers.type,
        },
        function (err, entArr) {
          if (err) throw err;
          if (!entArr)
            res
              .status(403)
              .send({ success: false, msg: "Type entities not found" });
          else res.json(entArr);
        }
      );
  },
};
module.exports = functions;
