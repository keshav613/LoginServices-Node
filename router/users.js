const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const jwtAuthenticate = require("../auths/jwtStategy");

router.use(express.urlencoded({ extended: false }));

router.get(
  "/home",
  (req, res, next) => jwtAuthenticate(req, res, next),
  (req, res) => {
    console.log("inside home page");
    res.status("200").send("inside home page");
  }
);

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
    res.status(200).send("new user added");
    //res.redirect("/login");
  });
});

router.post("/login", (req, res) => {
  console.log("inside login");
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) throw err;
    else if (!user)
      return res.status(400).send("User does not exist, pls register");

    bcrypt.compare(req.body.password, user.password, async (err, result) => {
      if (err) throw err;
      if (result) {
        req.user = user;
        await jwtSignAndSet(req, res);
        res.redirect("/home");
      } else res.status(201).send("Incorrect password");
    });
  });
});

router.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["email", "profile", "openid"] })
);

router.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/auth/google" }),
  async (req, res, next) => {
    await jwtSignAndSet(req, res);
    console.log("redirected to hom page");
  }
);

async function jwtSignAndSet(req, res) {
  jwt.sign(
    { name: req.user.name },
    process.env.JWT_SECRET_KEY,
    { expiresIn: 3600 },
    (err, token) => {
      if (err) throw err;
      res.cookie("jwt", token, { maxAge: 900000, httpOnly: true });
    }
  );
}

router.get(
  "/protected",
  (req, res, next) => jwtAuthenticate(req, res, next),
  (req, res) => {
    console.log(req.payload);
    res.status(200).send("success, JWT verified");
  }
);

router.get("/logout", function (req, res) {
  req.logOut();
  req.clearCookie("jwt");
  res.status(200).send("logged out");
});

module.exports = router;

/*
take req.cookie and doo in jwt stratagey.

and after login using google create a jwt and set as cookie.
*/
