"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaLoginResponse = exports.schemaLogin = exports.schemaUserResponse = void 0;
exports.routesUser = routesUser;
const zod_1 = require("zod");
const create_user_controller_1 = require("./create-user-controller");
const update_user_controller_1 = require("./update-user-controller");
const getall_user_controller_1 = require("./getall-user-controller");
const delete_user_controller_1 = require("./delete-user-controller");
const login_controller_1 = require("../auth/login-controller");
exports.schemaUserResponse = zod_1.z.object({
    id: zod_1.z.string(),
    nome: zod_1.z.string(),
    email: zod_1.z.string().email(),
    telefone: zod_1.z.string(),
    role: zod_1.z.string(),
});
exports.schemaLogin = zod_1.z.object({
    email: zod_1.z.string().email("Email inválido"),
    senha: zod_1.z.string().min(6, "Senha deve ter pelo menos 6 caracteres")
});
exports.schemaLoginResponse = zod_1.z.object({
    message: zod_1.z.string(),
    user: exports.schemaUserResponse,
    token: zod_1.z.string(),
});
async function routesUser(app) {
    app.post("/auth/login", {
        schema: {
            description: "Realiza login do usuário",
            tags: ["Autenticação"],
            body: exports.schemaLogin,
            response: {
                200: exports.schemaLoginResponse,
                400: zod_1.z.object({
                    message: zod_1.z.string(),
                    errors: zod_1.z.array(zod_1.z.any()).optional()
                }),
                401: zod_1.z.object({ message: zod_1.z.string() }),
                500: zod_1.z.object({ message: zod_1.z.string() }),
            },
        },
    }, login_controller_1.loginController);
    // LOGOUT
    app.post("/auth/logout", {
        schema: {
            description: "Realiza logout do usuário",
            tags: ["Autenticação"],
            response: {
                200: zod_1.z.object({ message: zod_1.z.string() }),
                500: zod_1.z.object({ message: zod_1.z.string() }),
            },
        },
    }, async (req, res) => {
        return res.status(200).send({
            message: "Logout realizado com sucesso"
        });
    });
    // CREATE
    app.post("/users", {
        schema: {
            description: "Cria um novo usuário",
            tags: ["Usuário"],
            body: create_user_controller_1.schemaCreateUser,
            response: {
                201: zod_1.z.object({ user: create_user_controller_1.schemaCreateUser }),
                400: zod_1.z.object({ message: zod_1.z.string() }),
            },
        },
    }, create_user_controller_1.createUserController);
    // UPDATE
    app.put("/users/:id", {
        schema: {
            description: "Atualiza um usuário",
            tags: ["Usuário"],
            params: zod_1.z.object({ id: zod_1.z.string() }),
            body: zod_1.z.object({
                nome: zod_1.z.string().optional(),
                email: zod_1.z.string().email().optional(),
                senha: zod_1.z.string().min(6).optional(),
                telefone: zod_1.z.string().optional(),
                role: zod_1.z.string().optional()
            }),
            response: {
                200: zod_1.z.object({ user: create_user_controller_1.schemaCreateUser }),
                400: zod_1.z.object({ message: zod_1.z.string() }),
            },
        },
    }, update_user_controller_1.updateUserController);
    // GET ALL
    app.get("/users", {
        schema: {
            description: "Lista todos os usuários",
            tags: ["Usuário"],
            response: {
                200: zod_1.z.object({
                    users: zod_1.z.array(exports.schemaUserResponse),
                }),
                400: zod_1.z.object({ message: zod_1.z.string() }),
            },
        },
    }, getall_user_controller_1.getAllUsersController);
    // DELETE
    app.delete("/users/:id", {
        schema: {
            description: "Deleta um usuário",
            tags: ["Usuário"],
            params: zod_1.z.object({ id: zod_1.z.string() }),
            response: {
                204: zod_1.z.null(), // No Content
                400: zod_1.z.object({ message: zod_1.z.string() }),
            },
        },
    }, delete_user_controller_1.deleteUserController);
}
