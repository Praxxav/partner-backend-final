import { Router } from "express";
import authRoutes from "./auth";
import productRoutes from "./products";
import usersRoutes from "./users"
import cartRoutes from "./cart";
import orderRoutes from "./orders";
import bundleRoutes from "./bundles";

const rootRouter: Router = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/products', productRoutes);
rootRouter.use('/users', usersRoutes);
rootRouter.use('/cart', cartRoutes);
rootRouter.use('/order', orderRoutes);
rootRouter.use('/bundles', bundleRoutes);


export default rootRouter;