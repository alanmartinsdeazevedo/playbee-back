import { PrismaUserRepository } from "../repositories/prisma/prisma-user-repository";
import { LoginUserUseCase } from "../use-cases/login-user-use-case";

export function makeLoginUserUseCase() {
    const userRepository = new PrismaUserRepository();
    const loginUserUseCase = new LoginUserUseCase(userRepository);
    
    return loginUserUseCase;
}