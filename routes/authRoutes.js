import express from "express";
import passport from "passport";
import { signupPage, loginPage, signup, logout } from "../controllers/authController.js";
import db from "../config/db.js";
import bcrypt from "bcrypt";


const router = express.Router();

// Pages
router.get("/login", loginPage);
router.get("/signup", signupPage);

// Actions
router.post("/signup", signup);
router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/failure",
}));

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   console.log("email:", email);
//   console.log("password:", password);
//   const user = await db.query("SELECT * FROM Users WHERE email = $1", [email]);
//   if (!user.rows[0])return res.redirect("/failure");

//   const match = await bcrypt.compare(password, user.rows[0].password_hash);
//   if (!match) {
//     console.log("password_hash:", user.rows[0].password_hash);
//     return res.redirect("/failure");
//   }
//   req.login(user.rows[0], (err) => {
//     if (err)return res.redirect("/failure");
//     res.redirect("/");
//   });
// });

router.get("/logout", logout);

export default router;
