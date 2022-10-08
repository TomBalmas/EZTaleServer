var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var entitySchema = new Schema({ 
    book: { 
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    picture: {
        type: String,
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
        return next();
});

//module.exports = mongoose.model('Entity', entitySchema);
module.exports = entitySchema