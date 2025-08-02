import { Request, Response } from 'express';
// import prisma client directly from its module
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Bundle Controllers
export const createBundle = async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const bundle = await prisma.bundle.create({
        data: {
            name,
            description
        }
    });
    res.json(bundle);
};

export const updateBundle = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const bundle = await prisma.bundle.update({
        where: { id: parseInt(id) },
        data: {
            name,
            description
        }
    });
    res.json(bundle);
};

export const deleteBundle = async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.bundle.delete({
        where: { id: parseInt(id) }
    });
    res.json({ message: 'Bundle deleted successfully' });
};

export const listBundles = async (req: Request, res: Response) => {
    const bundles = await prisma.bundle.findMany({
        include: {
            subBundles: {
                include: {
                    tiers: {
                        include: {
                            features: true
                        }
                    }
                }
            }
        }
    });
    res.json(bundles);
};

export const getBundleById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const bundle = await prisma.bundle.findUnique({
        where: { id: parseInt(id) },
        include: {
            subBundles: {
                include: {
                    tiers: {
                        include: {
                            features: true
                        }
                    }
                }
            }
        }
    });
    res.json(bundle);
};

// SubBundle Controllers
export const createSubBundle = async (req: Request, res: Response) => {
    const { bundleId } = req.params;
    const { name } = req.body;
    const subBundle = await prisma.subBundle.create({
        data: {
            name,
            bundleId: parseInt(bundleId)
        }
    });
    res.json(subBundle);
};

export const updateSubBundle = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    const subBundle = await prisma.subBundle.update({
        where: { id: parseInt(id) },
        data: { name }
    });
    res.json(subBundle);
};

export const deleteSubBundle = async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.subBundle.delete({
        where: { id: parseInt(id) }
    });
    res.json({ message: 'SubBundle deleted successfully' });
};

// Tier Controllers
export const createTier = async (req: Request, res: Response) => {
    const { subBundleId } = req.params;
    const { name, price } = req.body;
    const tier = await prisma.tier.create({
        data: {
            name,
            price,
            subBundleId: parseInt(subBundleId)
        }
    });
    res.json(tier);
};

export const updateTier = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, price } = req.body;
    const tier = await prisma.tier.update({
        where: { id: parseInt(id) },
        data: { name, price }
    });
    res.json(tier);
};

export const deleteTier = async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.tier.delete({
        where: { id: parseInt(id) }
    });
    res.json({ message: 'Tier deleted successfully' });
};

// Feature Controllers
export const createFeature = async (req: Request, res: Response) => {
    const { tierId } = req.params;
    const { name } = req.body;
    const feature = await prisma.feature.create({
        data: {
            name,
            tierId: parseInt(tierId)
        }
    });
    res.json(feature);
};

export const updateFeature = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    const feature = await prisma.feature.update({
        where: { id: parseInt(id) },
        data: { name }
    });
    res.json(feature);
};

export const deleteFeature = async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.feature.delete({
        where: { id: parseInt(id) }
    });
    res.json({ message: 'Feature deleted successfully' });
};
