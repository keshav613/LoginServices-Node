const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");
var jwt = require("jsonwebtoken");

module.exports = (req, res, done) => {
  if (!req.cookies["jwt"]) {
    console.log("login first");
    res.status(400).send("login first");
    return done(null, false);
  }
  jwt.verify(req.cookies["jwt"], process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) throw err;
    User.find(payload.email, (err, user) => {
      if (err) return done(null, false);
      return done(null, user);
    });
  });
};
