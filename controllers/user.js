import { validationResult } from "express-validator";
import { User } from "../mongodb/schema/user.js";
import { HttpError } from "../utils/HttpError.js";
import { StreamChat } from "stream-chat";

import * as dotenv from "dotenv";

dotenv.config();

const { STREAM_API_KEY, STREAM_API_SECRET } = process.env;
const client = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);

export const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, email, userPhoto } = req.body;
  let exisitingUser, newUser;

  try {
    exisitingUser = await User.findOne({ email: email });
  } catch (err) {
    new HttpError("Something went wrong", 422);
  }

  console.log("exisitingUser", exisitingUser);
  if (exisitingUser) {
    const streamToken = client.createToken(exisitingUser._id.toString());
    res.json({ ...exisitingUser._doc, streamToken });
  } else if (!exisitingUser) {
    try {
      newUser = new User({
        name,
        email,
        userPhoto,
      });
    } catch (err) {
      return next(new HttpError("Something went Wrong", 422));
    }

    try {
      await newUser.save();
      const streamToken = client.createToken(newUser._id.toString());
      console.log("user", user._doc);
      const sendData = {
        ...newUser,
        streamToken,
      };
      res.json(sendData);
    } catch (err) {
      return next(new HttpError("Something went Wrong", 422));
    }
  }
};

export const getAllUsers = async (req, res, next) => {
  let AllUsers;
  try {
    AllUsers = await User.find({});
  } catch (err) {
    return next(new HttpError("Something went Wrong", 422));
  }
  if (AllUsers) {
    res.json({ users: AllUsers });
  } else if (!AllUsers) {
    return next(new HttpError("No user found", 422));
  }
};
