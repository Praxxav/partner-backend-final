import express, { Express, Request, Response, NextFunction } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/errors";
import { SignUpSchema } from "./schemas/users";
import cors from 'cors';

const app: Express = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

app.use("/api", rootRouter);

export const prismaClient = new PrismaClient({
    log: ['query']
}).$extends({
    result: {
        address: {
            formattedAddress: {
                needs: {
                    lineOne: true,
                    lineTwo: true,
                    city: true,
                    country: true,
                    pincode: true
                },
                compute: (address) => {
                    return `${address.lineOne},${address.lineTwo},${address.city},${address.country},${address.pincode}`
                }
            }
        }
    }
})


// Error-handling middleware must be registered after all other middleware and routes
// @ts-ignore
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    errorMiddleware(err, req, res, next);
});

app.listen(PORT, () => console.log("App working !! "));