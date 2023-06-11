import { HttpStatusCode } from "axios";
import bcrypt from "bcrypt";
import { RequestHandler } from "express";

import User, { IUser } from "../Models/User";
import { generateJWTToken } from "../Utils/Jwt";

export const login: RequestHandler = async (req, res) => {
  const { email, password }: IUser = req.body;

  if (email === "") {
    return res
      .status(HttpStatusCode.InternalServerError)
      .json({ message: "Email is Required" });
  }
  if (password === "") {
    return res
      .status(HttpStatusCode.InternalServerError)
      .json({ message: "Password is Required" });
  }

  try {
    const dbUserDoc = await User.findOne({ email: email });
    if (dbUserDoc === null) {
      return res
        .status(HttpStatusCode.NotFound)
        .json({ success: false, message: "User not found" });
    }
    const validateUser = await bcrypt.compare(password, dbUserDoc.password);
    if (validateUser) {
      const token = await generateJWTToken(dbUserDoc._id.toString());
      return res.status(HttpStatusCode.Ok).json({
        success: true,
        message: "User Login Successful",
        token: token,
        role: dbUserDoc.role,
      });
    } else {
      return res
        .status(HttpStatusCode.InternalServerError)
        .json({ success: false, message: "Wrong Credentials" });
    }
  } catch (error) {
    return res
      .status(HttpStatusCode.InternalServerError)
      .json({ success: false, message: "Internal server error", error: error });
  }
};

export const createNewMember: RequestHandler = async (req, res) => {
  const { tokenPayload, name, email, phone, password, role } = req.body;
  const dbUserDoc = await User.findOne({ _id: tokenPayload?._id });

  if (dbUserDoc === null) {
    return res
      .status(HttpStatusCode.InternalServerError)
      .json({ success: false, message: "User not found", user: null });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role,
      phone,
    });
    await newUser.save();
    return res.status(HttpStatusCode.Ok).json({
      success: true,
      message: "New Member Added Successful",
      error: null,
    });
  } catch (error) {
    return res.status(HttpStatusCode.InternalServerError).json({
      success: false,
      message: "New Member Added Failed",
      error: error,
    });
  }
};
export const createSuperAdmin: RequestHandler = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role: "SUPER ADMIN",
      phone,
    });
    await newUser.save();
    return res.status(HttpStatusCode.Ok).json({
      success: true,
      message: "Super Admin Created Successful",
      error: null,
    });
  } catch (error) {
    return res.status(HttpStatusCode.InternalServerError).json({
      success: false,
      message: "Super Admin Creation Failed",
      error: error,
    });
  }
};

export const getUserProfile: RequestHandler = async (req, res) => {
  const { tokenPayload, token } = req.body;

  try {
    const dbUserDoc = await User.findOne({ _id: tokenPayload?._id });
    if (dbUserDoc === null) {
      return res
        .status(HttpStatusCode.NotFound)
        .json({ success: false, message: "User not found", user: null });
    }
    return res.status(HttpStatusCode.Ok).json({
      success: true,
      message: "User Information Retrieve Successful",
      user: dbUserDoc,
      token,
    });
  } catch (error) {
    return res.status(HttpStatusCode.InternalServerError).json({
      success: false,
      message: "User Information Retrieve Failed",
      error: error,
    });
  }
};

export const updateUserProfile: RequestHandler = async (req, res) => {
  const { tokenPayload, name, phone, password } = req.body;
  const dbUserDoc = await User.findOne({ _id: tokenPayload?._id });

  if (dbUserDoc === null) {
    return res
      .status(HttpStatusCode.InternalServerError)
      .json({ success: false, message: "User not found", user: null });
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  dbUserDoc.name = name;
  dbUserDoc.phone = phone;
  dbUserDoc.password = hashPassword;

  try {
    const updateResult = await User.findByIdAndUpdate(dbUserDoc._id, {
      ...dbUserDoc,
    });
    return res.status(HttpStatusCode.Ok).json({
      success: true,
      message: "User Information Updated Successful",
      user: updateResult,
      error: null,
    });
  } catch (error) {
    return res.status(HttpStatusCode.InternalServerError).json({
      success: false,
      message: "User Information Update Failed",
      error: error,
    });
  }
};

export const memberList: RequestHandler = async (req, res) => {
  const { tokenPayload } = req.body;

  try {
    const dbUserDoc = await User.findOne({ _id: tokenPayload?._id });
    if (dbUserDoc === null) {
      return res
        .status(HttpStatusCode.NotFound)
        .json({ success: false, message: "User not found", user: null });
    }
    const qurey: any = {};
    if (dbUserDoc.role === "ADMIN") {
      qurey.role = "USER";
    } else if (dbUserDoc.role === "USER") {
      qurey.role = "";
    }
    const result = await User.find(qurey);
    return res.status(HttpStatusCode.Ok).json({
      success: true,
      message: "Member Retrieve Successful",
      result,
    });
  } catch (error) {
    return res.status(HttpStatusCode.InternalServerError).json({
      success: false,
      message: "Member Retrieve Failed",
      error: error,
    });
  }
};
