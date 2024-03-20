import { Router } from "express";
import { registerUserValidateSchema } from "./user.validation.js";
import User from "./user.model.js";
import bcrypt from "bcrypt";
const router = Router();
// register user
// it is just creating a new user
// forgot not: to hash password before saving unto db
router.post(
  "/user/register",
  async (req, res, next) => {
    //extract data from req.body
    const data = req.body;
    // validate data using schema
    try {
      const validatedData = await registerUserValidateSchema.validate(data);
      req.body = validatedData;
    } catch (error) {
      // if validatation fails, throw error
      return res.status(401).send({ message: error.message });
    }

    //call next function
    next();
  },
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
export default router;
