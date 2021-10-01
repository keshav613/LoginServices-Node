const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Membership = require("../models/Membership");
const User = require("../models/User");

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        callbackURL: process.env.callbackURL,
      },
      (accessToken, refreshToken, profile, done) => {
        User.findOne(
          {
            thirdPartyProviderAuthID: profile.id,
          },
          (err, user) => {
            if (err || user) {
              return done(err, user);
            }
            const verifiedEmail =
              profile.emails.find((email) => email.verified) ||
              profile.emails[0];

            const newUser = new Membership({
              provider: profile.provider,
              providerId: profile.id,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              displayName: profile.displayName,
              email: verifiedEmail.value,
              password: null,
            });

            const user2 = new User({
              name: profile.name.givenName,
              email: verifiedEmail.value,
              thirdPartyProviderAuthID: profile.id,
            });

            newUser.save((err, user) => {
              if (err) throw done(null, false);
              console.log("created user using google auth", user.displayName);
            });

            user2.save((err, user) => {
              if (err) throw done(null, false);
              console.log("created user using google auth", user.displayName);
            });

            return done(null, newUser);
          }
        );
      }
    )
  );
  passport.serializeUser((user, done) => {
    return done(null, user);
  });

  passport.deserializeUser((user, done) => {
    return done(null, user);
  });
};
//         User.findOne({ email: profile.emails[0] }, function (err, user) {
//           if (err) {
//             return done(err);
//           }
//           //No user was found... so create a new user with values from Facebook (all the profile. stuff)
//           if (!user) {
//             let membership = new Membership({
//               provider: "Google",
//               id: profile.id,
//               name: "keshav", //profile.name,
//               email: "keshavmail", //profile.emails[0],
//             });
//             membership.save(function (err) {
//               if (err) console.log(err);
//             });
//             user = new User({
//               name: profile.name,
//               email: profile.emails[0],
//               usingThirdPartyAuth: true,
//             });
//             user.save(function (err) {
//               if (err) console.log(err);
//               return done(err, user);
//             });
//           } else {
//             //found user. Return
//             return done(err, user);
//           }
//         });
//       }
//     )
//   );

//   passport.serializeUser((user, done) => {
//     return done(null, user);
//   });

//   passport.deserializeUser((user, done) => {
//     return done(null, user);
//   });
// };
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const User = require("../models/User");

// module.exports = (passport) => {
//   passport.use(
//     new GoogleStrategy(
//       {
//         clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
//         callbackURL: process.env.callbackURL,
//       },
//       function (accessToken, refreshToken, profile, done) {
//         User.findOrCreate(
//           { googleId: profile.emails[0] },
//           function (err, user) {
//             return done(err, user);
//           }
//         );
//       }
//     )
//   );

//   passport.serializeUser((user, done) => {
//     return done(null, user);
//   });

//   passport.deserializeUser((user, done) => {
//     return done(null, user);
//   });
// };
