import express from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import path from "path";
import bodyParser from "body-parser";

import authRoutes from "./routes/authRoutes.js";
// import protectedRoutes from "./routes/protectedRoutes.js";
import db from "./config/db.js";
import "./config/passport.js"; // loads passport config

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", authRoutes);

// Home page – public
// app.get("/", (req, res) => {
//   res.render("index.ejs"); // homepage
// });
app.get("/", (req, res) => {
  res.render("index.ejs", { user: req.user }); // pass user to header
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
