const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET_KEY;
module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (payload, done) => {
      console.log(payload);
      User.find(payload, (err, user) => {
        if (err) return done(null, false);
        return done(null, user);
      });
    })
  );
  passport.serializeUser(function (user, done) {
    console.log("serialize user");
    done(null, user.adminId);
  });

  // de-serialization
  passport.deserializeUser(function (id, done) {
    dao.retrieveUserById(id, function (err, user) {
      console.log("de-serialize user");
      done(err, user);
    });
  });
};
