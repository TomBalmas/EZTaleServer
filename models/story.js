var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var storySchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  bookName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: true,
  },
  coWriters:{
    type:Array,
    required: false
  },
  deadLines:{
    typr:Array,
    required: false
  }
});

storySchema.pre("save", function (next) {
  var story = this;
  return next();
});

module.exports = storySchema;
