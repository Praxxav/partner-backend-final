import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";
import { UnprocessableEntity } from "../exceptions/validation";
import { SignUpSchema } from "../schemas/users";
import { NotFoundException } from "../exceptions/not-found";

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    let user = await prismaClient.user.findFirst({ 
        where: { email },
        select: {
            id: true,
            email: true,
            FirstName: true,
            LastName: true,
            role: true,
            password: true,
            defaultBillingAddressId: true,
            defaultShippingAddressId: true,
            createdAt: true,
            updatedAt: true
        }
    });

    if (!user) {
        throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
    }

    if (!compareSync(password, user.password)) {
        throw new BadRequestException("Incorrect password", ErrorCode.INCORRECT_PASSWORD);
    }

    const token = jwt.sign({
        userId: user.id,
        email: user.email,
        role: user.role
    }, JWT_SECRET, { expiresIn: '24h' });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
        success: true,
        data: {
            user: userWithoutPassword,
            token
        }
    });

}

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Use safeParse instead of parse to handle validation errors gracefully
        const validation = SignUpSchema.safeParse(req.body);
        
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.errors
            });
        }

        const { email, password, FirstName, LastName } = validation.data;

        // Check if user already exists
        const existingUser = await prismaClient.user.findFirst({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
                errorCode: ErrorCode.USER_ALREADY_EXISTS
            });
        }

        // Hash password
        const hashedPassword = hashSync(password, 10);

        // Create new user
        const user = await prismaClient.user.create({
            data: {
                email,
                password: hashedPassword,
                FirstName,
                LastName
            },
            select: {
                id: true,
                email: true,
                FirstName: true,
                LastName: true,
                role: true,
                defaultBillingAddressId: true,
                defaultShippingAddressId: true,
                createdAt: true,
                updatedAt: true
            }
        });

        // Generate token
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not configured');
        }
        
        const token = jwt.sign({
            userId: user.id,
            email: user.email,
            role: user.role
        }, JWT_SECRET, { expiresIn: '24h' });

        return res.status(201).json({
            success: true,
            data: {
                user,
                token
            }
        });
    } catch (error: any) {
        console.error('Signup error:', error);
        
        // Check if it's a Prisma error
        if (error.code === 'P2002') {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

// export const me = async (req: any, res: Response, next: NextFunction) => {
//     const userId = req.user?.id;

//     if (!userId) {
//         throw new BadRequestException("Not authenticated", ErrorCode.USER_NOT_FOUND);
//     }

//     const user = await prismaClient.user.findUnique({
//         where: { id: userId },
//         select: {
//             id: true,
//             email: true,
//             FirstName: true,
//             LastName: true,
//             role: true,
//             defaultBillingAddressId: true,
//             defaultShippingAddressId: true,
//             createdAt: true,
//             updatedAt: true,
//             addresses: true
//         }
//     });

//     if (!user) {
//         throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
//     }

//     res.json({
//         success: true,
//         data: {
//             user
//         }
//     });
// }