"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsersController = getAllUsersController;
const make_getall_user_use_case_1 = require("@/domain/user/@factories/make-getall-user-use-case");
async function getAllUsersController(req, res) {
    try {
        const getAllUsersUseCase = (0, make_getall_user_use_case_1.makeGetAllUsersUseCase)();
        const users = await getAllUsersUseCase.execute();
        return res.status(200).send(users);
    }
    catch (error) {
        return res.status(400).send({
            message: "Erro ao buscar usuários",
            error: error.message
        });
    }
}
