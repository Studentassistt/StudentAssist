const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

let db = require('./db.json');

app.get("/", (req, res) => res.render("index"));

app.get("/signup", (req, res) => res.render("signup"));
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  db.users.push({ username, password });
  fs.writeFileSync("db.json", JSON.stringify(db));
  res.redirect("/login");
});

app.get("/login", (req, res) => res.render("login"));
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = db.users.find(u => u.username === username && u.password === password);
  if (user) return res.redirect("/newsfeed");
  else res.send("Invalid credentials");
});

app.get("/admin", (req, res) => res.render("admin"));
app.post("/admin", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin123") {
    return res.redirect("/newsfeed");
  } else res.send("Admin login failed");
});

app.get("/newsfeed", (req, res) => res.render("newsfeed", { posts: db.posts }));
app.get("/market", (req, res) => res.render("market", { items: db.market }));
app.get("/chat", (req, res) => res.render("chat"));
app.get("/terms", (req, res) => res.render("terms"));

app.listen(port, () => console.log(`StudentAssist running on ${port}`));
