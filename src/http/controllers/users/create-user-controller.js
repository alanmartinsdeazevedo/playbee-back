"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaCreateUser = void 0;
exports.createUserController = createUserController;
const make_create_user_use_case_1 = require("@/domain/user/@factories/make-create-user-use-case");
const axios_1 = require("axios");
const zod_1 = __importDefault(require("zod"));
exports.schemaCreateUser = zod_1.default.object({
    nome: zod_1.default.string(),
    email: zod_1.default.string().email(),
    senha: zod_1.default.string().min(6),
    telefone: zod_1.default.string(),
    role: zod_1.default.string()
});
async function createUserController(req, res) {
    try {
        const { nome, email, senha, telefone, role } = exports.schemaCreateUser.parse(req.body);
        console.log('Criando usuário:', { nome, email, telefone, role });
        const createUserUseCase = (0, make_create_user_use_case_1.makeCreateUserUseCase)();
        const result = await createUserUseCase.execute({
            email,
            nome,
            senha,
            telefone,
            role
        });
        console.log('Usuário criado:', result);
        const user = result.user || result;
        const userResponse = {
            id: user.id,
            nome: user.nome,
            email: user.email,
            telefone: user.telefone,
            role: user.role
        };
        return res.status(axios_1.HttpStatusCode.Created).send(userResponse);
    }
    catch (error) {
        console.error("Erro ao criar usuário:", error);
        if (error instanceof zod_1.default.ZodError) {
            return res.status(axios_1.HttpStatusCode.BadRequest).send({
                message: "Dados inválidos",
                errors: error.errors
            });
        }
        if (error instanceof Error) {
            if (error.message.includes("já está em uso")) {
                return res.status(axios_1.HttpStatusCode.Conflict).send({
                    message: error.message
                });
            }
        }
        return res.status(axios_1.HttpStatusCode.InternalServerError).send({
            message: "Erro interno do servidor"
        });
    }
}
