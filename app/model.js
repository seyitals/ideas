var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var IdeaSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  kind: {
    type: String,
    default: 'personal'
  }
});

module.exports = mongoose.model('Ideas', IdeaSchema);