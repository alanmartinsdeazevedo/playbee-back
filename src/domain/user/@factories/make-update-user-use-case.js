"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUpdateUserUseCase = makeUpdateUserUseCase;
const prisma_user_repository_1 = require("@/domain/user/repositories/prisma/prisma-user-repository");
const update_user_use_case_1 = require("../use-cases/update-user-use-case");
function makeUpdateUserUseCase() {
    const userRepository = new prisma_user_repository_1.PrismaUserRepository();
    return new update_user_use_case_1.UpdateUserUseCase(userRepository);
}
