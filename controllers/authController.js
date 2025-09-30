import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import db from "../config/db.js";

const saltRounds = 10;

//login page
export const loginPage = (req, res) => {
  res.render("login.ejs");
};

//signup page
export const signupPage = (req, res) => {
  res.render("signup.ejs");
};

//signup action
export const signup = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const checkUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (checkUser.rows.length > 0) {
      return res.redirect("/login");
    }

    const hash = await bcrypt.hash(password, saltRounds);

    const result = await db.query(
      `INSERT INTO users (name, email, phone, password_hash, role, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *`,
      [name, email, phone, hash, "customer"]
    );

    const user = result.rows[0];
    req.login(user, (err) => {
      if (err) return res.redirect("/login");
      res.redirect("/");
    });
  } catch (err) {
    console.error(err);
    res.redirect("/signup");
  }
};

//logout action
export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};
