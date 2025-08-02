import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';

const prisma = new PrismaClient();

async function createSuperAdmin() {
    try {
        // Check if super admin already exists
        const existingAdmin = await prisma.user.findFirst({
            where: {
                email: 'admin@example.com',
                role: 'ADMIN'
            }
        });

        if (existingAdmin) {
            console.log('Super admin already exists!');
            return;
        }

        // Create super admin
        const superAdmin = await prisma.user.create({
            data: {
                email: 'admin@example.com',
                password: hashSync('admin123', 10),
                FirstName: 'Admin',
                LastName: 'User',
                role: 'ADMIN'
            }
        });

        console.log('Super admin created successfully:', superAdmin);
    } catch (error) {
        console.error('Error creating super admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createSuperAdmin();
