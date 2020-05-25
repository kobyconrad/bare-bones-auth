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

// TODO: this code should go into another file 



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
    "username": req.body.username
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
      return res.status(401).send("unauthorized");
    }

    // @ts-ignore
    const hashPassword = loginData.hashPassword;
    console.log("the stored password is: ", hashPassword)
    console.log(password)
    const isCorrectPassword = bcrypt.compareSync(password, hashPassword);

    //TODO:  Figure out why this isnt working
    console.log(isCorrectPassword)
    if (!isCorrectPassword) {
      console.log("wrong password")
      // res.status(401).send("wrong password");
    }
    console.log("good password")
    // res.status(200).json({
    //   username,
    // });

  })

  // if (!users[username]) {
  //   res.status(401).send("User doesn't exist");
  // }

  // Checking password
  // TODO: get hashed password from users record
  // const hash = users[username];

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

app.get("/user-info", (req, res) => {
  // Someone isn't logged in
  const token = req.cookies["session-token"];

  // grab sessions[token] from database
  dbContext.Session.findOne({ "token": token }, function (err, session) {
    if (err) throw console.error(err)

    if (!session) {
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

function getOne(aToken) {
  let retData = dbContext.Session.findOne({ token: aToken })
  return retData
}

app.get("/", (req, res) => res.send("Hello World!"));



app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
