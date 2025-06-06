import { PrismaUserRepository } from "../repositories/prisma/prisma-user-repository";
import { CreateUserUseCase } from "../use-cases/create-user-use-case";

export function makeCreateUserUseCase() {
    const userRepository = new PrismaUserRepository();
    const createUserUseCase = new CreateUserUseCase(userRepository);
    
    return createUserUseCase;
}