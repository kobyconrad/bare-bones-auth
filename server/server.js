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

app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const hash = bcrypt.hashSync(password, 10);
  users[username] = hash;

  // Creating session
  const token = nanoid();
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
    res.status(401).send("unauthorized");
  }

  // Checking password
  const hash = users[username];
  const isCorrectPassword = bcrypt.compareSync(password, hash);
  if (!isCorrectPassword) {
    res.status(401).send("unauthorized");
  }

  // Creating session
  const token = nanoid();
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
  const session = sessions[token];
  if (!session) {
    return res.status(401).send("unauthorized");
  }

  // Their particular userinfo
  const username = session.username;

  res.status(200).json({
    username,
  });
});

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
