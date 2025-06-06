"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const prisma_1 = require("@/lib/prisma");
class PrismaUserRepository {
    async create(user) {
        const createdUser = await prisma_1.prisma.user.create({
            data: {
                ...user
            }
        });
        return createdUser;
    }
    async update(id, data) {
        const updatedUser = await prisma_1.prisma.user.update({
            where: { id },
            data: {
                ...data
            }
        });
        return updatedUser;
    }
    async getAllUsers() {
        const users = await prisma_1.prisma.user.findMany({
            include: { reservas: true }
        });
        return users;
    }
    async findById(id) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id },
            include: { reservas: true }
        });
        return user;
    }
    async delete(id) {
        await prisma_1.prisma.user.delete({
            where: { id }
        });
    }
    // NOVO: Buscar usuário por email
    async findByEmail(email) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
            include: { reservas: true }
        });
        return user;
    }
}
exports.PrismaUserRepository = PrismaUserRepository;
