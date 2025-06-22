import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

// Extend the Express Request to include user
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

interface DecodedToken {
  id: string;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer")) {
      throw new Error("No token, authorization denied");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next(); // ✅ important
  } catch (err) {
    next(err); // ✅ pass to global error handler
  }
};
