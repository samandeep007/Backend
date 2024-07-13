import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide an username'],
      unique: [true, 'Username already exists'],
      lowercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: [true, 'Email already exists'],
      lowercase: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    avatar: {
      type: String,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    }
    
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.modified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async (password) => {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async () => {
  return await jwt.sign(
    {
      _id: this._id,
      username: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = async () => {
  return jwt.sign(
    {
      _id: _id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
