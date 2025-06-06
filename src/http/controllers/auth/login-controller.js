"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = loginController;
const make_login_user_use_case_1 = require("@/domain/user/@factories/make-login-user-use-case");
const axios_1 = require("axios");
const zod_1 = __importDefault(require("zod"));
const schemaLogin = zod_1.default.object({
    email: zod_1.default.string().email("Email inválido"),
    senha: zod_1.default.string().min(6, "Senha deve ter pelo menos 6 caracteres")
});
async function loginController(req, res) {
    try {
        const { email, senha } = schemaLogin.parse(req.body);
        const loginUserUseCase = (0, make_login_user_use_case_1.makeLoginUserUseCase)();
        const { user, token } = await loginUserUseCase.execute({ email, senha });
        return res.status(axios_1.HttpStatusCode.Ok).send({
            message: "Login realizado com sucesso",
            user,
            token
        });
    }
    catch (error) {
        console.error("Erro no login:", error);
        if (error instanceof zod_1.default.ZodError) {
            return res.status(axios_1.HttpStatusCode.BadRequest).send({
                message: "Dados inválidos",
                errors: error.errors
            });
        }
        if (error instanceof Error) {
            if (error.message.includes("Email ou senha incorretos")) {
                return res.status(axios_1.HttpStatusCode.Unauthorized).send({
                    message: error.message
                });
            }
        }
        return res.status(axios_1.HttpStatusCode.InternalServerError).send({
            message: "Erro interno do servidor"
        });
    }
}
