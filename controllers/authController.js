import bcrypt from "bcrypt";
import db from "../config/db.js";

const saltRounds = 10;

//login page
export const loginPage = (req, res) => {
  res.render("login.ejs");
};

//signup page
export const signupPage = (req, res) => {
  res.render("signup.ejs", { error: null });
};

//profile page
export const profilePage = (req, res) => {
  // Example: if you stored user info in req.session or req.user
  const user = req.session.user || null;
  res.render("profile.ejs", { user });  // ✅ send user to EJS
};

//cart page
export const cartPage = (req, res) => {
  // Example: if you stored user info in req.session or req.user
  const user = req.session.user || null;
  res.render("cart.ejs", { user });  // ✅ send user to EJS
};

//signup action
export const signup = async (req, res) => {
  //  Extracts form data (name, email, phone, password) from the HTTP request body.
  const { name, email, phone, password } = req.body;

  //   Checks if a user already exists with the same email.
  try {
    const checkUser = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (checkUser.rows.length > 0) {
        console.log("error: Email already registered. Please login.");
      return res.render("signup", {
        error: "Email already registered. Please login.",
      });
    }
    // Hashes the user’s plain-text password using bcrypt for security.
    const hash = await bcrypt.hash(password, saltRounds);

    const result = await db.query(
      `INSERT INTO users (name, email, phone, password_hash, role, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *`,
      [name, email, phone, hash, "customer"]
    );
    // Takes the newly inserted user and logs them in immediately using Passport’s req.login().
    const user = result.rows[0];
    req.login(user, (err) => {
      if (err) return res.redirect("/login");
      res.redirect("/");
    });
  } catch (err) {
    //   If anything goes wrong (DB error, bcrypt error, etc.), log it and send the user back to the signup page.
    console.error(err);
    res.redirect("/signup");
  }
};

//logout action
export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // 🔥 remove from browser
      res.redirect("/login");
    });
  });
};
