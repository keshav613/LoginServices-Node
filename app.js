const express = require('express');
const app = express();
const port = process.env.port || 3000;
const loginRouter = require('./router/users')
const passport = require('passport');
const mongoose = require("mongoose");
const dbstring = 'mongodb://localhost:27017/';
var session = require('express-session');

app.use(session({secret: 'cats'}));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
require('dotenv').config()
//app.use(passport);

mongoose.connect(dbstring, {
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
require('./auths/jwtStategy')(passport);
require('./auths/googleAuth')(passport);

app.use("/", loginRouter)

app.listen(port);