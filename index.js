import express from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import path from "path";
import bodyParser from "body-parser";
import multer from "multer";


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

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/profiles/");
  },
  filename: (req, file, cb) => {
    cb(null, req.user.user_id + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage: storage });

// Upload route
app.post("/upload-profile", upload.single("profilePic"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    // File name will be like "123.png"
    const filename = req.user.user_id + path.extname(req.file.originalname);

    // Update DB
    await db.query(
      "UPDATE users SET profile_pic = $1 WHERE user_id = $2",
      [filename, req.user.user_id]
    );

    console.log("Profile picture updated for user:", req.user.user_id);
    res.redirect("/profile");
  } catch (err) {
    console.error("Error updating profile picture:", err);
    res.status(500).send("Server error");
  }
});

app.get("/", (req, res) => {
  res.render("index.ejs", { user: req.user }); // pass user to header
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
