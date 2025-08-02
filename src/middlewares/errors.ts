import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/root";

export const errorMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof HttpException) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
            errorCode: error.errorCode,
            errors: error.errors
        });
    } else {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
}