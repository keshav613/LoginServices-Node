var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var membershipSchema = new Schema({
  provider: String,
  providerId: String,
  firstname: String,
  lastname: String,
  displayname: String,
  email: String,
  password: {
    type: String,
    default: null,
  },
  dateAdded: { type: Date, default: Date.now },
});

module.exports = Membership = mongoose.model("Membership", membershipSchema);
