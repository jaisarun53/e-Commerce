import { Schema, model } from "mongoose";

// set rule
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    maxlength: 65,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
    enum: ["seller", "buyer"],
  },
  gender: {
    type: String,
    required: false,
    trim: true,
    enum: ["male", "female", "preferNotToSay"],
  },
});

// create table
const User = model("User", userSchema);

export default User;
