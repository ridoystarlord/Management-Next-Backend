import { verifyToken } from "../Utils/Jwt";

const TokenVerify = async (req: any, res: any, next: any): Promise<void> => {
  try {
    const bearerToken = req?.headers?.authorization;
    const token = bearerToken?.split("Bearer ")[1];
    const tokenPayload: string = await verifyToken(token);
    req.body.tokenPayload = tokenPayload;
    req.body.token = token;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication Failed",
      error,
    });
  }
};
export default TokenVerify;
