import fastify from "fastify";
import cors from '@fastify/cors';

import { validatorCompiler, serializerCompiler, ZodTypeProvider, jsonSchemaTransform, hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'
import { appRoutes } from "./http/routes";
import { ZodError } from "zod";

export const app = fastify({
    logger: true
}).withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(cors, {
    origin: [
        'http://localhost:3001',        // Frontend
        'http://127.0.0.1:3000',        // localhost
        'http://play.beezes.com.br'     // Produção
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
});

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
    if(hasZodFastifySchemaValidationErrors(error)){

        const errorMessages: string[] = error.validation.map((value) => {
            return value.message
        })

        console.log(error)
 
        return reply
            .status(400)
            .send({ message: "Validation Schema Error." , issues: errorMessages })
    }

    if(error instanceof ZodError){
        
        return reply
            .status(400)
            .send({ message: "Validation Schema Error" , issues: error.flatten().fieldErrors })
    }

    return reply.status(500).send({ message: 'Internal server error.' })
})