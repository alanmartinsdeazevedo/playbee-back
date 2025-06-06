import { prisma } from "@/lib/prisma";
import { UserParamsFunctionRepository } from "../../types/params/user";
import { UserReturnFunctionRepository } from "../../types/return/user";
import { UserRepository } from "../user-repository";

export class PrismaUserRepository implements UserRepository {
    async create(user: UserParamsFunctionRepository["createUser"]): Promise<UserReturnFunctionRepository["getUser"]> {
        const createdUser = await prisma.user.create({
            data: {
                ...user
            }
        })
        return createdUser;
    }

    async update(id: string, data: UserParamsFunctionRepository["updateUser"]): Promise<UserReturnFunctionRepository["getUser"]> {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                ...data
            }
        });
        return updatedUser;
    }

    async getAllUsers(): Promise<UserReturnFunctionRepository["getUser"][]> {
        const users = await prisma.user.findMany({
            include: { reservas: true }
        });

        return users;
    }

    async findById(id: string): Promise<UserReturnFunctionRepository["getUser"] | null> {
        const user = await prisma.user.findUnique({
            where: { id },
            include: { reservas: true }
        });
        return user;
    }

    async delete(id: string): Promise<void> {
        await prisma.user.delete({
            where: { id }
        });
    }

    // NOVO: Buscar usuário por email
    async findByEmail(email: string): Promise<UserReturnFunctionRepository["getUser"] | null> {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { reservas: true }
        });
        return user;
    }
}