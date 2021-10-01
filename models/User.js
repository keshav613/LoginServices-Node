const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  thirdPartyProviderAuthID: {
    type: String,
    default: null,
  },
});

//jsonwebtoken to send token, passport to validate and extract token
module.exports = User = mongoose.model("users", UserSchema);

/*
for logging in with credentials you need to signup first and store unam,pwd in db
for logging in with google no need to save pwd in db for cross check, just save user details in membership page
*/
