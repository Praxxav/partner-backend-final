import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";

const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
        }

        const token = authHeader.split(' ')[1];
        const payload = jwt.verify(token, JWT_SECRET) as any;

        const user = await prismaClient.user.findFirst({ where: { id: payload.userId } })

        if (!user) {
            return next(new UnauthorizedException("User not found", ErrorCode.UNAUTHORIZED));
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new UnauthorizedException("Invalid token", ErrorCode.UNAUTHORIZED));
        }
        return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));

    }

}

export default authMiddleware;