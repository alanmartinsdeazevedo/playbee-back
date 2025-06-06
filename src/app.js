"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const routes_1 = require("./http/routes");
const zod_1 = require("zod");
exports.app = (0, fastify_1.default)({
    logger: true
}).withTypeProvider();
exports.app.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
exports.app.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
exports.app.register(cors_1.default, {
    origin: [
        'http://localhost:3000', // Frontend
        'http://127.0.0.1:3000', // localhost
        'http://play.beezes.com.br' // Produção
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
});
exports.app.register(routes_1.appRoutes);
exports.app.setErrorHandler((error, _, reply) => {
    if ((0, fastify_type_provider_zod_1.hasZodFastifySchemaValidationErrors)(error)) {
        const errorMessages = error.validation.map((value) => {
            return value.message;
        });
        console.log(error);
        return reply
            .status(400)
            .send({ message: "Validation Schema Error.", issues: errorMessages });
    }
    if (error instanceof zod_1.ZodError) {
        return reply
            .status(400)
            .send({ message: "Validation Schema Error", issues: error.flatten().fieldErrors });
    }
    return reply.status(500).send({ message: 'Internal server error.' });
});
