const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

router.use(express.urlencoded({ extended: false }));

router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) throw err;
    else if (user)
      return res.status(400).send("User with this mail already exists");

    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) throw err;

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });

      newUser.save((err, user) => {
        if (err) throw err;
        res.json(user.name);
      });
    });
  });
});

router.post("/login", (req, res) => {
  console.log("inside login");
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) throw err;
    else if (!user)
      return res.status(400).send("User does not exist, pls register");

    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) throw err;
      if (result) {
        const payload = {
          name: user.name,
          email: user.email,
        };
        jwt.sign(
          payload,
          process.env.JWT_SECRET_KEY,
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;
            res.json({
              success: true,
              toekn: "Bearer " + token,
            });
          }
        );
      } else res.status(201).send("Incorrect password");
    });
  });
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/failed",
  })
);
const isLoggeddIn = (req, res, next) => {
  req.user ? next() : res.redirect("/login");
};
router.get("/protected", isLoggeddIn, (req, res) => {
  res.send("google logged in");
});

router.get("/failed", (req, res) => {
  res.send("google logged in failed");
});
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

router.get("/logout", function (req, res) {
  console.log("logout called");
  res.statusCode(200).send("logged out");
});

module.exports = router;
