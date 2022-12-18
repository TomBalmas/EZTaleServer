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
    if (req.body.name && req.body.bookName && req.body.username)
      modelEntity.findOne(
        {
          bookName: req.body.bookName,
          username: req.body.username,
          name: req.body.name,
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
    if (req.body.bookName && req.body.username && req.body.type)
      modelEntity.find(
        {
          username: req.body.username,
          bookName: req.body.bookName,
          type: req.body.type,
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
  editEntity: (req, res) => {
    modelEntity = mongoose.model("Entity", Entity);
    if (req.body.name && req.body.bookName && req.body.username && req.body.type) {
      modelEntity.deleteOne({
        name: req.body.name,
        bookName: req.body.bookName,
        username: req.body.username,
        relations: req.body.relations,
        mentioned: req.body.mentioned
      }, (err) => { if (err) throw err; });
      functions.addEntity(req, res);
    }
  },
  deleteEntity: (req, res) => {
    modelEntity = mongoose.model("Entity", Entity);
    if (req.body.name && req.body.bookName && req.body.username) {
      modelEntity.deleteOne({
        name: req.body.name,
        bookName: req.body.bookName,
        username: req.body.username
      },
        (err) => {
          if (err) throw err;
          else
            res.json({ success: true, msg: "Entity Deleted" });
        });
    }

  },
  addRelation: (req, res) => {
    modelEntity = mongoose.model("Entity", Entity);
    if (req.body.name && req.body.bookName && req.body.username && req.body.relateTo) {
      modelEntity.findOne({
        name: req.body.name,
        bookName: req.body.bookName,
        username: req.body.username,
        relateTo: req.body.relateTo
      }, (err, entity) => {
        if (err) throw err;
        entity.relations.push(req.body.relateTo);
        entity.save();
      }
      );
      modelEntity.findOne({
        name: req.body.relateTo,
        bookName: req.body.bookName,
        username: req.body.username,
        relateTo: req.body.name
      }, (err, entity) => {
        if (err) throw err;
        entity.relations.push(req.body.name);
        entity.save();
      }
      );
      res.json({ success: true, msg: "Relation added" });
    }
  },
  deleteRelation: (req, res) => {
    modelEntity = mongoose.model("Entity", Entity);
    if (req.body.name && req.body.bookName && req.body.username && req.body.relateTo) {
      modelEntity.findOne({
        name: req.body.name,
        bookName: req.body.bookName,
        username: req.body.username,
        relateTo: req.body.relateTo
      }, (err, entity) => {
        if (err) throw err;
        const index = entity.relations.indexOf(req.body.relateTo);
        if (index > -1)  // only splice array when item is found
          entity.relations.splice(index, 1); // 2nd parameter means remove one item only
        else
          res.json({ success: false, msg: "can't find relation" });

        entity.save();
      }
      );
      modelEntity.findOne({
        name: req.body.relateTo,
        bookName: req.body.bookName,
        username: req.body.username,
        relateTo: req.body.name
      }, (err, entity) => {
        if (err) throw err;
        const index = entity.relations.indexOf(req.body.name);
        if (index > -1)  // only splice array when item is found
          entity.relations.splice(index, 1); // 2nd parameter means remove one item only
        else
          res.json({ success: false, msg: "can't find relation" });
        entity.save();
        res.json({ success: true, msg: "Relation deleted" });
      });
    }
  }

};
module.exports = functions;
