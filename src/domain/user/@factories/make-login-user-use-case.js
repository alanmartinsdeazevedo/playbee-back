"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeLoginUserUseCase = makeLoginUserUseCase;
const prisma_user_repository_1 = require("../repositories/prisma/prisma-user-repository");
const login_user_use_case_1 = require("../use-cases/login-user-use-case");
function makeLoginUserUseCase() {
    const userRepository = new prisma_user_repository_1.PrismaUserRepository();
    const loginUserUseCase = new login_user_use_case_1.LoginUserUseCase(userRepository);
    return loginUserUseCase;
}
