import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

// interface RequestUserPayload extends Request{
//   currentUser: UserPayload
// }

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

// export const currentUser = (req: RequestUserPayload, res: Response, next: NextFunction)=>{
export const currentUserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_SECRET!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (error) {}
  next();
};
