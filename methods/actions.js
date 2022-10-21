var User = require('../models/user');
var jwt = require('jwt-simple');
var config = require('../config/dbconfig');
const mongoose = require('mongoose');
const Entity = require('../models/entity');
const Story = require('../models/story');
const fs = require('fs');

var functions = {
    addNewUser: function(req, res) { 
        if((!req.body.name)  || (!req.body.surname) || (!req.body.username) || (!req.body.password) || (!req.body.email) ) { 
            res.json({success: false, msg: 'Enter all fields'});
        }
        else { 
            var newUser = User({
                name: req.body.name,
                surname: req.body.surname,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            });
            newUser.save(function(err, newUser) { 
                if (err) 
                    res.json({success: false, msg: 'Failed to save'});
                else 
                    res.json({success: true, msg: 'Successfully saved'});
            });
        }
    },
    authenticate: function(req, res) { 
        User.findOne({
            username: req.body.username,
        },
        function(err, user) {
            if (err) throw err;
            if(!user) 
                res.status(403).send({success:false, msg: 'Auth Failed, User not found'});
            else { 
                user.comparePassword(req.body.password, function (err,isMatch) { 
                    if(isMatch && !err) { 
                        var token = jwt.encode(user, config.secret);
                        res.json({success: true, token: token});
                    }
                    else { 
                        return res.status(403).send({success: false, msg:'Auth Failed, Wrong password'});
                    }
                });
            }
        });
    },
    getInfo: function(req, res) { 
        if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1];
            var decodedToken = jwt.decode(token, config.secret);
            return res.json({success: true, msg: 'Hello ' + decodedToken.username});
        }
        else { 
            return res.json({success: false, msg:'No Headers'});
        }
    },
    getEmail: function(req, res) { 
        if(req.headers.email){
            User.findOne({email: req.headers.email},function (err, user){
                if(err) throw err;
                if(user) 
                    return res.json({success: true, msg: 'Email Found: ' + user.email});
                else
                    return res.json({success: true, msg: 'Email Not Found'})
            });  
        }
        else 
            return res.json({success: false, msg:'No Headers'});
    },
    getUsername: function(req, res) { 
        if(req.headers.username){
            User.findOne({username: req.headers.username},function (err, user){
                if(err) throw err;
                if(user) 
                    return res.json({success: true, msg: 'UserName Found: ' + user.username});
                else
                    return res.json({success: true, msg: 'UserName Not Found'})
            });  
        }
        else 
            return res.json({success: false, msg:'No Headers'});

    },
    addEntity: function(req, res) { 
        modelEntity = mongoose.model('Entity',Entity)

        // character,
        // location,
        // conversation,
        // storyEvent,
        // userDefined,
        // atrributeTemplate,
        switch (req.body.type) { 
            case 'character': 
                Entity.add({
                    surename: {
                        type: String,
                        required : false
                    },
                    personalityTraits: { 
                        type: String,
                        required: false
                    },
                    appearanceTraits: { 
                        type: String,
                        required: false
                    },
                    age: {
                        type: Number,
                        required: false
                    },
                    gender: { 
                        type: String,
                        required: true
                    }
                });
                var newEntity = modelEntity({
                    book: req.body.book,
                    type: req.body.type,
                    picture: req.body.picture,
                    name: req.body.name,
                    relations: req.body.relations,
                    surename: req.body.surename,
                    personalityTraits: req.body.personalityTraits,
                    appearanceTraits: req.body.age,
                    gender: req.body.gender
                });
                break;
            case 'location':
                Entity.add({
                    vista: { 
                        type: String,
                        required: false
                    }
                });
                var newEntity = modelEntity({
                    book: req.body.book,
                    type: req.body.type,
                    picture: req.body.picture,
                    name: req.body.name,
                    relations: req.body.relations,
                    vista:req.body.vista
                });
                break;
            case 'conversation':
                Entity.add({
                    participants: { 
                        type: Array,
                        required:True
                    }
                });
                var newEntity = modelEntity({
                    book: req.body.book,
                    type: req.body.type,
                    picture: req.body.picture,
                    name: req.body.name,
                    relations: req.body.relations,
                    participants: req.body.participants
                });
                break;
            case 'storyEvent':
                Entity.add({
                    desc: {
                        type: String,
                        required: false
                    }
                })
                var newEntity = modelEntity({
                    book: req.body.book,
                    type: req.body.type,
                    picture: req.body.picture,
                    name: req.body.name,
                    relations: req.body.relations,
                    desc: req.body.desc
                });
                break;
            case 'attributeTemplate':
                Entity.add({
                    attributes: {
                        type: String,
                        required: false
                    }
                });
                var newEntity = modelEntity({
                    book: req.body.book,
                    type: req.body.type,
                    picture: req.body.picture,
                    name: req.body.name,
                    relations: req.body.relations,
                    attributes:req.body.attributes
                });
                break;
            case 'userDefined':
                var atrrs  = req.body.attributes.split('|');
                atrrs.forEach( (atr) => {
                    Entity.add({
                    [atr]: {
                            type: String,
                            required: false
                        }
                    });
                });
                var vals = req.body.values.split('|');
                var userDef = new Map([
                    ["book", req.body.book],
                    ["type", req.body.type],
                    ["picture", req.body.picture],
                    ["name", req.body.name],
                    ["relations",req.body.relations],
                ]);
                for(var i=0 ; i < atrrs.length; i++)
                    userDef.set(atrrs[i],vals[i]);
                var newEntity = modelEntity(Object.fromEntries(userDef));
        }
        if(newEntity)
            newEntity.save(function(err, newEntity) { 
                if (err) 
                    res.json({success: false, msg: 'Failed to save' + err});
                else 
                    res.json({success: true, msg: 'Successfully saved'});
            });
        else
            res.json({success: false, msg: 'Failed to save no entity created'});
    },
    getEntity: function(req, res) { 
        modelEntity = mongoose.model('Entity',Entity);
        if(req.headers.name && req.headers.book)
            modelEntity.findOne({name: req.headers.name, book:req.headers.book},function (err, ent) {
                if (err) throw err;
                if(!ent) 
                    res.status(403).send({success:false, msg: 'Entity not found'});
                else 
                    res.json(ent);
            });

    },
    getAllEntities: function(req, res) { 
        modelEntity = mongoose.model('Entity',Entity);
        if(req.headers.book)
            modelEntity.find({book: req.headers.book},function (err, entArr) {
                if (entArr) throw err;
                if(!entArr) 
                    res.status(403).send({success:false, msg: 'Entities not found'});
                else 
                    res.json(entArr);
            });
    },
    getAllUserDefinedEntities: function(req, res) { 
        modelEntity = mongoose.model('Entity',Entity);
        if(req.headers.book)
            modelEntity.find({book: req.headers.book, type:'userDefined'},function (err, entArr) {
                if (entArr) throw err;
                if(!entArr) 
                    res.status(403).send({success:false, msg: 'User Defined Entities not found'});
                else 
                    res.json(entArr);
            });
    },
    addNewStory: (req, res) => {
        modelStory = mongoose.model('Story', Story);
        var newStory = modelStory({
            token: req.body.token, // to know who own the story
            name: req.body.name,
            type: req.body.type
        });
        if(newStory)
            newStory.save(function(err, newStory) { 
                if (err) 
                    res.json({success: false, msg: 'Failed to save' + err});
                else {
                    let filePath = 'stories/' + req.body.name + '.ezt';
                    fs.writeFile(filePath, req.body.name, function(err) {
                        if(err) 
                            res.json({success: false, msg: 'Failed to save story file in server' + err});
                        res.json({success: true, msg: 'Story Saved Successfully'});
                    }); 
                }
        });
    },
    getStories: (req, res) => { 
        modelStory = mongoose.model('Story', Story);
        if(req.headers.token)
        modelEntity.find({token: req.headers.token},function (err, stories) {
            if (entArr) throw err;
            if(!entArr) 
                res.status(403).send({success:false, msg: 'Stories not found'});
            else 
                res.json(stories);
        });
    },
    getStory:(req, res) => { 
        if(req.headers.token && req.headers.name ){
            let internalFilePath = 'stories/' + req.body.name + '.ezt';
            let filePath = __dirname.replace('methods','stories\\') + req.headers.name + '.ezt';
            if(!fs.existsSync(internalFilePath))
                res.status(403).send({success:false, msg: 'Story file not found'});
            else
                res.sendFile(filePath, (err) => {
                    if (err) 
                        console.log(err);
                     else 
                        console.log('Sent:', filePath);
                });
        }
    },
    saveStory: (req, res) => { 
        if(req.file && req.body.name) { 
            //let filePath = 'stories/' + req.body.name + '.ezt';
            //fs.writeFile(filePath, req.file, function(err) {
            res.json({success: true, msg: 'Story Saved Successfully'});
            }//); 
        }
}


module.exports = functions;
