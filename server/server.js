require("dotenv").config();
require = require("esm")(module);

const mongoose = require("mongoose");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connection.on("error", err => {
  console.error("[DATABASE ERROR]:", err);
});
mongoose.connection.on("connection", () => {
  console.log("DbConnection Successful");
});

const express = require("express");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const cors = require("cors");
const cookieParser = require("cookie-parser");
//const MongoClient = require("mongodb").MongoClient

const connectionString = "mongodb+srv://juamster:Kq7baj7l@cluster0-ef91t.mongodb.net/sjh?retryWrites=true&w=majority"

// Connecting to database
mongoose.connect(connectionString)
let status = 0;
try {
  let status = mongoose.connect(connectionString, { useUnifiedTopology: true });
  console.log("[CONNECTION TO DB SUCCESSFUL]");

} catch (e) {
  console.error(
    "[MONGOOSE CONNECTION ERROR]:",
    "Invalid connection string"
  );
}

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

const Schema = mongoose.Schema;

let ProfileSchema = new Schema(
  {
    subs: [{ type: String, unique: false, required: false }],
    hashPassword: { type: String, lowercase: true },
    username: { type: String, required: true },
    email: { type: String, unique: false },
    _queryable: { type: Boolean, default: true }
    // NOTE If you wish to add additional public properties for profiles do so here
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

let Profile = mongoose.model("Profile", ProfileSchema)

let SessionSchema = new Schema(
  {
    token: { type: String, lowercase: true },
    username: { type: String, required: true },
    _queryable: { type: Boolean, default: true }

  },
  { timestamps: true, toJSON: { virtuals: true } }
);
let Session = mongoose.model("Session", SessionSchema)

app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const hash = bcrypt.hashSync(password, 10);
  // TODO: save this to database instead of fake database
  users[username] = hash;
  let data = {
    "subs": `${Math.random()}`,
    "hashPassword": hash,
    "username": req.body.username
  }
  Profile.create(data).catch((err) => {
    if (err) throw console.error(err)
  })

  // Creating session
  const token = nanoid();
  // TODO: save session token to database instead of fake database 

  let tokenData = {
    "username": req.body.username,
    "token": token
  }

  Session.create(tokenData).catch((err) => {
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

  if (!users[username]) {
    res.status(401).send("User doesn't exist");
  }

  // Checking password
  // TODO: get hashed password from users record
  const hash = users[username];

  const isCorrectPassword = bcrypt.compareSync(password, hash);
  if (!isCorrectPassword) {
    res.status(401).send("wrong password");
  }

  // Creating session
  const token = nanoid();
  // TODO: save sessions[token] to database
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
  Session.findOne({ "token": token }, function (err, session) {
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
  let retData = Session.findOne({ token: aToken })
  return retData
}

app.get("/", (req, res) => res.send("Hello World!"));


// DbContext.connect();

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
