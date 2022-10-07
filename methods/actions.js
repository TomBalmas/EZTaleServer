var User = require('../models/user');
var jwt = require('jwt-simple');
var config = require('../config/dbconfig');
const Entity = require('../models/entity');

var functions = {
    addNew: function(req, res) { 
        if((!req.body.name)  || (!req.body.surname) || (!req.body.username) || (!req.body.password) || (!req.body.email) ) { 
            res.json({success: false, msg: 'Enter all fields'});
        }
        else { 
            var newUser = User({
                name: req.body.name,
                surname: req.body.surname,
                username: req.body.usermame,
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
                        res.json({success: true, token: token})
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
    addEntity: function(req, res) { 
        // character,
        // location,
        // conversation,
        // storyEvent,
        // userDefined,
        // atrributeTemplate,
        if(err) throw err;
        switch (req.body.type) { 
            case 'character': 
                newEntity.add({
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
                break;
            case 'location':
                newEntity.add({
                    vista: { 
                        type: String,
                        required: false
                    }
                });
                break;
            case 'conversation':
                newEntity.add({
                    participants: { 
                        type: Array,
                        required:True
                    }
                });
                break;
            case 'storyEvent':
                newEntity.add({
                    desc: {
                        type: String,
                        required: false
                    }
                })
                break;
            // TODO: Add more entitiy like user defined and templates 
        }



        var newEntity = Entity({
            type: req.body.type,
            picture: req.body.picture,
            name: req.body.name,
            relations: req.body.relations
        });
        newEntity.save(function(err, newUser) { 
            if (err) 
                res.json({success: false, msg: 'Failed to save'});
            else 
                res.json({success: true, msg: 'Successfully saved'});
        });
    }
}

module.exports = functions;
