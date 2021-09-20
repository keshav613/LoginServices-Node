const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../models/User");

module.exports = passport =>{
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GGOGLE_OAUTH_CLIENT_SECRET,
        callbackURL: "localhost:3000/google/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));
    
    passport.serializeUser((user, done)=>{
        return done(null, user);
    });
    
    passport.deserializeUser((user, done)=>{
        return done(null, user);
    });
}
