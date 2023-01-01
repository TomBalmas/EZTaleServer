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
            type: Array,
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
        Entity.add({
          attributes: {
            type: Array,
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
    }
    if (newEntity)
      newEntity.save(function (err, newEntity) {
        if (err) res.json({ success: false, msg: "Failed to save" + err });
        else res.json({ success: true, msg: "Successfully saved" });
      });
    else res.json({ success: false, msg: "Failed to save no entity created" });
  },
  addAttribute: (req, res) => {
    modelEntity = mongoose.model("Entity", Entity);
    if (
      req.body.name &&
      req.body.bookName &&
      req.body.username &&
      req.body.type &&
      req.body.attr &&
      req.body.val
    ) {
      modelEntity.findOne(
        {
          name: req.body.name,
          bookName: req.body.bookName,
          username: req.body.username,
          type: req.body.type,
        },
        (err, entity) => {
          if (err) throw err;
          entity.attributes.push({
            attr: req.body.attr,
            val: req.body.val,
          });
          entity.save();
        }
      );
    }
  },
  deleteAttribute: (req, res) => {
    modelEntity = mongoose.model("Entity", Entity);
    if (
      req.body.name &&
      req.body.bookName &&
      req.body.username &&
      req.body.type &&
      req.body.attr &&
      req.body.val
    ) {
      modelEntity.findOne(
        {
          name: req.body.name,
          bookName: req.body.bookName,
          username: req.body.username,
          type: req.body.type,
        },
        (err, entity) => {
          if (err) throw err;
          const index = entity.attributes.indexOf({
            attr: req.body.attr,
            val: req.body.val,
          });
          if (index > -1)
            // only splice array when item is found
            entity.attributes.splice(index, 1);
          entity.save();
        }
      );
    }
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
    if (req.body.bookName && req.body.username)
      modelEntity.find(
        { bookName: req.body.bookName, username: req.body.username },
        function (err, entArr) {
          if (err) throw err;
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
    if (
      req.body.name &&
      req.body.bookName &&
      req.body.username &&
      req.body.type
    ) {
      modelEntity.deleteOne(
        {
          name: req.body.name,
          bookName: req.body.bookName,
          username: req.body.username,
          relations: req.body.relations,
          mentioned: req.body.mentioned,
        },
        (err) => {
          if (err) throw err;
        }
      );
      functions.addEntity(req, res);
    }
  },
  deleteEntity: (req, res) => {
    modelEntity = mongoose.model("Entity", Entity);
    if (req.body.name && req.body.bookName && req.body.username) {
      modelEntity.deleteOne(
        {
          name: req.body.name,
          bookName: req.body.bookName,
          username: req.body.username,
        },
        (err) => {
          if (err) throw err;
          else res.json({ success: true, msg: "Entity Deleted" });
        }
      );
    }
  },
  addRelation: (req, res) => {
    modelEntity = mongoose.model("Entity", Entity);
    if (
      req.body.name &&
      req.body.bookName &&
      req.body.username &&
      req.body.relateTo &&
      req.body.type &&
      req.body.typeRelateTo
    ) {
      modelEntity.findOne(
        {
          name: req.body.name,
          bookName: req.body.bookName,
          username: req.body.username,
          type: req.body.type,
        },
        (err, entity) => {
          if (err) throw err;
          entity.relations.push({
            relateTo: req.body.relateTo,
            type: req.body.typeRelateTo,
          });
          entity.save();
        }
      );
      modelEntity.findOne(
        {
          name: req.body.relateTo,
          bookName: req.body.bookName,
          username: req.body.username,
          type: req.body.typeRelateTo,
        },
        (err, entity) => {
          if (err) throw err;
          entity.relations.push({
            relateTo: req.body.name,
            type: req.body.type,
          });
          entity.save();
        }
      );
      res.json({ success: true, msg: "Relation added" });
    }
  },
  deleteRelation: (req, res) => {
    modelEntity = mongoose.model("Entity", Entity);
    if (
      req.body.name &&
      req.body.bookName &&
      req.body.username &&
      req.body.relateTo &&
      req.body.type &&
      req.body.typeRelateTo
    ) {
      modelEntity.findOne(
        {
          name: req.body.name,
          bookName: req.body.bookName,
          username: req.body.username,
          type: req.body.type,
        },
        (err, entity) => {

          if (err) throw err;
          const index = entity.relations.findIndex( (obj) => {
            return obj.relateTo == req.body.relateTo && obj.type == req.body.typeRelateTo;
          });
          if (index > -1)
            // only splice array when item is found
            entity.relations.splice(
              index,
              1
            ); // 2nd parameter means remove one item only
          else {
            res.json({ success: false, msg: "can't find relation 1" });
            return;
          }
          entity.save();
        }
      );
      modelEntity.findOne(
        {
          name: req.body.relateTo,
          bookName: req.body.bookName,
          username: req.body.username,
          relateTo: req.body.name,
          type: req.body.typeRelateTo,
        },
        (err, entity) => {
          if (err) throw err;
          const index = entity.relations.findIndex( (obj) => {
            return obj.relateTo == req.body.name && obj.type == req.body.type;
          });
          if (index > -1)
            // only splice array when item is found
            entity.relations.splice(
              index,
              1
            ); // 2nd parameter means remove one item only
          else {
            res.json({ success: false, msg: "can't find relation 2" });
            return;
          }
          entity.save();
          res.json({ success: true, msg: "Relation deleted" });
        }
      );
    }
  },
};
module.exports = functions;
