"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreateUserUseCase = makeCreateUserUseCase;
const prisma_user_repository_1 = require("../repositories/prisma/prisma-user-repository");
const create_user_use_case_1 = require("../use-cases/create-user-use-case");
function makeCreateUserUseCase() {
    const userRepository = new prisma_user_repository_1.PrismaUserRepository();
    const createUserUseCase = new create_user_use_case_1.CreateUserUseCase(userRepository);
    return createUserUseCase;
}
