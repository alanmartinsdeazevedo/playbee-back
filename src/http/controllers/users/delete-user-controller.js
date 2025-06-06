"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserController = deleteUserController;
const zod_1 = __importDefault(require("zod"));
const make_delete_user_use_case_1 = require("@/domain/user/@factories/make-delete-user-use-case");
const axios_1 = require("axios");
const schemaParams = zod_1.default.object({
    id: zod_1.default.string().uuid(),
});
async function deleteUserController(req, res) {
    const { id } = schemaParams.parse(req.params);
    try {
        const deleteUserUseCase = (0, make_delete_user_use_case_1.makeDeleteUserUseCase)();
        await deleteUserUseCase.execute(id);
        return res.status(axios_1.HttpStatusCode.NoContent).send();
    }
    catch (error) {
        console.error("Erro ao deletar usuário:", error);
        return res.status(axios_1.HttpStatusCode.InternalServerError).send({
            message: "Erro ao deletar usuário",
            error: error.message,
        });
    }
}
