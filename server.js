import express from "express";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
const { sign, verify } = jwt;
import cors from "cors";
import fs from "fs";
import HttpError from "./http-error.js";
import { config } from "dotenv";
config();

const PORT = process.env.PORT;
const app = express();

app.use(cors({ origin: ["*"] }));

/**
 * @typedef {{
 *  email: string,
 *  passwordHash: string
 * }} User
 */

// Create data file if it doesn't exist
try {
  fs.writeFileSync("users.json", JSON.stringify([]), { flag: "wx" });
} catch (error) {}

/**
 * @type {User[]}
 */
const users = JSON.parse(fs.readFileSync("users.json").toString());

//Middleware
app.use(express.json());

// Signup
app.post("/signup", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (password.length < 8) {
    res.status(400).send({ message: "Password must be 8+ characters." });
    return;
  }

  if (users.find((user) => user.email == email)) {
    res.status(400).send({ message: "Email is already in use." });
    return;
  }

  const passwordHash = await hash(password, 10);

  const user = {
    email: email,
    passwordHash: passwordHash,
  };

  users.push(user);
  fs.writeFileSync("users.json", JSON.stringify(users));

  res.status(201).send({ message: "Signup successful!" });
});

// Login
app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const token = await login(email, password);
    res.status(200).send({ message: "Login successful!", token: token });
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).send({ message: error.message });
      return;
    }

    throw error;
  }
});

// Authenticate the user when they try to do something
// that requires authentication.
app.post("/authenticate", (req, res) => {
  const token = req.body.token;

  if (!verify(token, process.env.JWT_SECRET)) {
    res.status(400).send({ message: "Invalid token." });
    return;
  }

  res.status(200).send({
    message: "Authentication successful!",
    user: verify(token, process.env.JWT_SECRET),
  });
});

async function login(email, password) {
  // Find a user with a matching email
  const user = users.find((user) => user.email == email);

  if (!user) {
    throw new HttpError(400, "No user found with that email.");
  }

  // If the password doesn't match...
  if (!(await compare(password, user.passwordHash))) {
    throw new HttpError(400, "Incorrect password.");
  }

  return sign(
    JSON.stringify({
      email: user.email,
    }),
    process.env.JWT_SECRET
  );
}

app.get("/test", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin: *");

  res.status(200).send({ message: "hello world" });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
