import { HttpStatusCode } from "axios";

import User from "../Models/User";

const CheckEmail = async (req: any, res: any, next: any): Promise<void> => {
  try {
    const { email } = req.body;

    const dbUserDoc = await User.findOne({ email: email });
    if (dbUserDoc !== null) {
      return res
        .status(HttpStatusCode.BadRequest)
        .json({ success: false, message: "This Email Already Exist." });
    }
    next();
  } catch (error) {
    return res.status(HttpStatusCode.InternalServerError).json({
      success: false,
      message: "Something Went Wrong",
      error,
    });
  }
};
export default CheckEmail;
