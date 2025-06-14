// src/http/controllers/users/get-user-by-id-controller.ts

import { makeGetUserByIdUseCase } from "@/domain/user/@factories/make-get-user-by-id-use-case";
import { HttpStatusCode } from "axios";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const schemaParams = z.object({
    id: z.string().uuid()
});

export async function getUserByIdController(req: FastifyRequest, res: FastifyReply) {
    try {
        console.log('🔍 Iniciando busca de usuário por ID...');
        
        const { id } = schemaParams.parse(req.params);
        console.log('✅ ID validado:', id);

        const getUserByIdUseCase = makeGetUserByIdUseCase();
        console.log('✅ Use Case criado');

        const result = await getUserByIdUseCase.execute(id);
        console.log('✅ Resultado do Use Case:', result);

        // O Use Case retorna { user }, então enviamos direto
        return res.status(HttpStatusCode.Ok).send(result);
    } catch (error) {
        console.error('❌ Erro detalhado no controller:', error);
        
        // Verificar se é erro de usuário não encontrado
        if (error instanceof Error && error.message.includes('não encontrado')) {
            return res.status(HttpStatusCode.NotFound).send({
                message: "Usuário não encontrado",
                error: error.message,
            });
        }

        return res.status(HttpStatusCode.InternalServerError).send({
            message: "Erro ao buscar usuário",
            error: (error as Error).message,
        });
    }
}