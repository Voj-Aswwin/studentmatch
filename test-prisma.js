const { PrismaClient } = require('@prisma/client');
try {
    const prisma = new PrismaClient();
    console.log('PrismaClient instantiated successfully');
} catch (e) {
    console.error('Failed to instantiate PrismaClient:', e);
}
