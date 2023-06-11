import mongoose from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    phone: {
      type: String,
      required: [true, "Phone is Required"],
    },
    role: {
      type: String,
      enum: {
        values: ["SUPER ADMIN", "ADMIN", "USER"],
        message: "Role Must Be Valid",
      },
      default: "USER",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
