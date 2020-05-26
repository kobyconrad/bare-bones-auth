import database from "./db/DbConfig"
import { dbContext } from "./db/DbContext"

const express = require("express");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());

const port = 3001;

// Fake database
const users = {};
const sessions = {};

const COOKIE_OPTIONS = {
  httpOnly: true,
  domain: "localhost",
  secure: false,
  path: "/",
  // 30 days
  expires: new Date(Date.now() + 60 * 60 * 24 * 1000 * 30),
};


// Connect to the database here
database.connect();

app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const hash = bcrypt.hashSync(password, 10);
  // TODO: save this to database instead of fake database
  users[username] = hash;
  console.log("password when register is:", hash)
  let data = {
    "subs": `${Math.random()}`,
    "hashPassword": hash,
    "username": req.body.username,
    "loggedIn": true
  }

  dbContext.Profile.create(data).catch((err) => {
    if (err) throw console.error(err)
  })

  // Creating session
  const token = nanoid();
  // TODO: save session token to database instead of fake database 

  let tokenData = {
    "username": req.body.username,
    "token": token
  }

  dbContext.Session.create(tokenData).catch((err) => {
    if (err) throw console.error(err)
  })

  sessions[token] = {
    username,
  };

  // Creating a cookie
  res.cookie("session-token", token, COOKIE_OPTIONS);

  res.status(200).send("ok");
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // grab username from database
  dbContext.Profile.findOne({ "username": username }, function (err, loginData) {
    if (err) throw console.error(err)

    if (!loginData) {
      return res.status(401).send("User doesn't exist");
    }

    // @ts-ignore
    const hashPassword = loginData.hashPassword;

    const isCorrectPassword = bcrypt.compareSync(password, hashPassword);


    if (!isCorrectPassword) {
      res.status(401).send("wrong password");
      // res.end();
    } else {
      const token = nanoid();

      const tokenData = {
        "username": req.body.username,
        "token": token,
        "loggedIn": true
      }

      dbContext.Session.create(tokenData).catch((err) => {
        if (err) throw console.error(err)
      })
      res.cookie("session-token", token, COOKIE_OPTIONS);

      res.status(200).send("ok");

    }
  })


});

app.get("/user-info", (req, res) => {
  // Someone isn't logged in
  const token = req.cookies["session-token"];

  // grab sessions[token] from database
  dbContext.Session.findOne({ "token": token }, function (err, session) {
    console.log(session)
    if (err) throw console.error(err)

    // @ts-ignore
    if (!session || !session.loggedIn) {
      return res.status(401).send("unauthorized");
    }

    // Their particular userinfo
    // @ts-ignore
    const username = session.username;

    res.status(200).json({
      username,
    });
  })

});

app.get("/logout", (req, res) => {

  const token = req.cookies['session-token'];

  dbContext.Session.findOneAndUpdate({ "token": token }, { "loggedIn": false }, function (err, session) {
    if (err) {
      res.status(401);
      throw console.error(err)
    }
    console.log(session);
  })

  res.clearCookie('session-token');
  res.send('logout')
  res.status(200)

})

function getOne(aToken) {
  let retData = dbContext.Session.findOne({ token: aToken })
  return retData
}

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
