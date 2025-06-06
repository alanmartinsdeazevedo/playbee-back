"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetAllUsersUseCase = makeGetAllUsersUseCase;
const prisma_user_repository_1 = require("@/domain/user/repositories/prisma/prisma-user-repository");
const getall_user_use_case_1 = require("@/domain/user/use-cases/getall-user-use-case");
function makeGetAllUsersUseCase() {
    const userRepository = new prisma_user_repository_1.PrismaUserRepository();
    return new getall_user_use_case_1.GetAllUsersUseCase(userRepository);
}
