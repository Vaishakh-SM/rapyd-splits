import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./req";

export type Middleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;