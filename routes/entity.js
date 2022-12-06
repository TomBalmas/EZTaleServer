const express = require("express");
const entity_actions = require("../methods/entity_actions");
const router = express.Router();

//@desc Add new entity
//@route POST /entity/addentitiy
//@body (forAll: type, book, username, picture, name, relations)
// everything else depend on which type
router.post("/addentity", entity_actions.addEntity);

//@desc Get Entity
//@route GET /entity/getentitiy
//@headers name, book username
router.get("/getentity", entity_actions.getEntity);

//@desc Get All Book entities
//@route GET /entity/getall
//@headers book username
router.get("/getall", entity_actions.getAllEntities);

//desc Get All Book type entities
//@route GET /entity/getalltype
//@headers book username type
router.get("/getalltype", entity_actions.getAllTypeEntities);

//desc delete entity
//@route POST /entity/deleteentity
//@headers bookName username name
router.post("/deleteentity", entity_actions.deleteEntity);

module.exports = router;
