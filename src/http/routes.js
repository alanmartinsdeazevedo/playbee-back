"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRoutes = void 0;
const zod_1 = __importDefault(require("zod"));
const _routes_1 = require("./controllers/users/@routes");
const appRoutes = async (app) => {
    app.post('/', {
        schema: {
            description: "Essa rota serve para verificar se a API está online",
            tags: ["Teste 🔞"],
            response: {
                201: zod_1.default.object({
                    api: zod_1.default.string().default("Status da API")
                }),
            }
        }
    }, async (request, reply) => {
        return reply.status(200).send({
            api: "Online 🚀"
        });
    }),
        app.register(_routes_1.routesUser);
};
exports.appRoutes = appRoutes;
