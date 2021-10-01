require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.port || 3000;
const loginRouter = require("./router/users");
const passport = require("passport");
const mongoose = require("mongoose");
const dbstring = `mongodb+srv://${process.env.dbUsername}:${process.env.dbPassword}@cluster0.0gcba.mongodb.net/${process.env.dbName}?retryWrites=true&w=majority`;
var session = require("express-session");
var cookieParser = require("cookie-parser");
app.use(session({ secret: "cats" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(dbstring, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(function () {
    console.log("success, connected to DB !!");
  })
  .catch(function (err) {
    console.log("no connection " + err);
  });

app.use(passport.initialize());
app.use(passport.session());
require("./auths/googleAuth")(passport);

app.use("/", loginRouter);

app.listen(port);
