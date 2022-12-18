const express = require("express");
const entity_actions = require("../methods/entity_actions");
const router = express.Router();

//@desc Add new entity
//@route POST /entity/addentitiy
//@body (forAll: type, book, username, picture, name, relations)
// everything else depend on which type
router.post("/addentity", entity_actions.addEntity);

//@desc Get Entity
//@route POST /entity/getentity
//@headers name, book username
router.post("/getentity", entity_actions.getEntity);

//@desc Get All Book entities
//@route GET /entity/getall
//@headers book username
router.get("/getall", entity_actions.getAllEntities);

//desc Get All Book type entities
//@route GET /entity/getalltype
//@headers book username type
router.post("/getalltype", entity_actions.getAllTypeEntities);

//desc delete entity
//@route POST /entity/deleteentity
//@headers bookName username name
router.post("/deleteentity", entity_actions.deleteEntity);

//desc edit entity
//@route POST /entity/editentity
//@headers bookName username name relations mentioned
router.post("/editentity", entity_actions.editEntity);

//desc add relation
//@route POST /entity/addrelation
//@headers bookName username name relateTo 
router.post("/addrelation", entity_actions.addRelation);

//desc delete relation
//@route POST /entity/deleterelation
//@headers bookName username name relateTo 
router.post("/deleterelation", entity_actions.deleteRelation);


module.exports = router;
