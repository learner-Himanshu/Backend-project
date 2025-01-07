import mongoose, { Mongoose, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      lowerCase: true,
      index: true
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      lowerCase: true
    },
    fullName: {
      type: String,
      trim: true,
      required: true,
      index: true
    },
    avatar: {
      type: String,
      required: true
    },
    coverImage: {
      type: String
    },
    watchHistory: {
      type: Schema.Types.ObjectId,
      ref: "Video"
    },
    password: {
      type: String,
      required: [true, "password is required."]
    },
    refreshToken: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPassswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.accessTokenGenerator = function () {
 return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
      userName: this.userName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  );
};
userSchema.methods.refreshTokenGenerator = function () {
 return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  );
};
export const User = mongoose.model("User", userSchema);
