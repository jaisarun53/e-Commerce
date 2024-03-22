import { Router } from "express";
import {
  loginUserValidationSchema,
  registerUserValidateSchema,
} from "./user.validation.js";
import User from "./user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validateReqBody from "../middleware/validation.middleware.js";
const router = Router();
// register user
// it is just creating a new user
// forgot not: to hash password before saving unto db
router.post(
  "/user/register",
  validateReqBody(registerUserValidateSchema),
  async (req, res) => {
    // extract new data from req.body
    const newUser = req.body;
    // check if user eith provided email already exist in our system--------
    // find user by email
    const user = await User.findOne({ email: newUser.email });
    // if user throw error
    if (user) {
      return res.status(409).send({ message: "user already exist" });
    }
    // just before saving user we need to  create hash password------
    const planePassword = newUser.password;
    const saltRound = 10;
    const hashPassword = await bcrypt.hash(planePassword, saltRound);
    // update new user password eith hashpassword
    newUser.password = hashPassword;
    // save user
    await User.create(newUser);
    // send response
    return res.status(201).send({ message: "user registered successfully" });
  }
);
// login user
router.post(
  "/user/login",
  validateReqBody(loginUserValidationSchema),
  async (req, res) => {
    // extract new data from req.body
    const loginCredentail = req.body;
    // find user by email from login credentials
    const user = await User.findOne({ email: loginCredentail.email });
    // if user not found throw error
    if (!user) {
      return res.status(400).send({ message: "invalid Credentials" });
    }
    // check for password match
    const planePassword = loginCredentail.password;
    const hashPassword = user.password;
    const isPasswordMatched = await bcrypt.compare(planePassword, hashPassword);

    // if not match throw error
    if (!isPasswordMatched) {
      return res.status(400).send({ message: "invalid Credentials" });
    }
    // generate access token
    const payload = { email: user.email };
    const token = jwt.sign(payload, "123456789abcdefghi");
    // to hide password
    user.password = undefined;
    // send response
    return res.status(200).send({ message: "success" });
  }
);
export default router;
