var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var entitySchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  bookName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  relations: {
    type: Array,
    required: false,
  },
  mentioned: {
    type: Array,
    required: false,
  },
});

entitySchema.pre("save", function (next) {
  var entity = this;
  return next();
});

module.exports = entitySchema;
