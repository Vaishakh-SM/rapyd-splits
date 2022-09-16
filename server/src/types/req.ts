import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  authToken?: string;
  userId?: string;
}
