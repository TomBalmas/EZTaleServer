var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var entityTypes = {
    
};

var entitySchema = new Schema({ 
    type: {
        type: String,
        required: true
    },
    picture: {
        type: Image,
        required: false
    },
    name: { 
        type: String,
        required: true
    },
    relations: { 
        type: Array,
        required: false
    },
    mentioned: { 
        type: Array,
        required: false
    } 
});



entitySchema.pre('save',function (next) { 
    var entity = this;
    if (err)
        return next(err);
    else  
        return next();
    
});

module.exports = mongoose.model('Entity', entitySchema), entityTypes;