"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserController = updateUserController;
const zod_1 = __importDefault(require("zod"));
const make_update_user_use_case_1 = require("@/domain/user/@factories/make-update-user-use-case");
const axios_1 = require("axios");
const paramsSchema = zod_1.default.object({
    id: zod_1.default.string().uuid(),
});
const bodySchema = zod_1.default.object({
    nome: zod_1.default.string().optional(),
    email: zod_1.default.string().email().optional(),
    senha: zod_1.default.string().min(6).optional(),
    telefone: zod_1.default.string().optional(),
    role: zod_1.default.string().optional(),
});
async function updateUserController(req, res) {
    try {
        const { id } = paramsSchema.parse(req.params);
        const data = bodySchema.parse(req.body);
        const updateUserUseCase = (0, make_update_user_use_case_1.makeUpdateUserUseCase)();
        const { user } = await updateUserUseCase.execute({ id, ...data });
        return res.status(axios_1.HttpStatusCode.Ok).send({ user });
    }
    catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        return res.status(axios_1.HttpStatusCode.InternalServerError).send({
            message: "Erro ao atualizar usuário",
            error: error.message,
        });
    }
}
