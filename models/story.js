var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var storySchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  name: {
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
});

storySchema.pre("save", function (next) {
  var story = this;
  return next();
});

module.exports = storySchema;
