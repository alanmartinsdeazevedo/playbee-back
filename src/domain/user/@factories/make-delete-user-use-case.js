"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDeleteUserUseCase = makeDeleteUserUseCase;
const prisma_user_repository_1 = require("@/domain/user/repositories/prisma/prisma-user-repository");
const delete_user_use_case_1 = require("../use-cases/delete-user-use-case");
function makeDeleteUserUseCase() {
    const userRepository = new prisma_user_repository_1.PrismaUserRepository();
    return new delete_user_use_case_1.DeleteUserUseCase(userRepository);
}
