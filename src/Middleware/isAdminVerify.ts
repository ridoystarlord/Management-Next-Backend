import { HttpStatusCode } from "axios";

import User from "../Models/User";

const isAdminVerify = async (req: any, res: any, next: any): Promise<void> => {
  try {
    const { tokenPayload } = req.body;

    const dbUserDoc = await User.findOne({ _id: tokenPayload?._id });
    if (dbUserDoc === null) {
      return res
        .status(HttpStatusCode.NotFound)
        .json({ success: false, message: "User not found", user: null });
    }
    if (dbUserDoc.role !== "SUPER ADMIN") {
      return res.status(HttpStatusCode.Forbidden).json({
        success: false,
        message: "You Don't have Permission",
      });
    }
    req.body.user = dbUserDoc;
    next();
  } catch (error) {
    return res.status(HttpStatusCode.InternalServerError).json({
      success: false,
      message: "Something Went Wrong",
      error,
    });
  }
};
export default isAdminVerify;
