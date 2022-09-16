import { Request } from "express";

export interface AuthenticatedRequest extends Request {
	authId?: string;
	authToken?: string;
	userId?: string;
}