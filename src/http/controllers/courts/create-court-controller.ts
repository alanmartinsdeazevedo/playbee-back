import { makeCreateCourtUseCase } from "@/domain/court/@factories/make-create-court-use-case";
import { HttpStatusCode } from "axios";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export const schemaCreateCourt = z.object({
    nome: z.string(),
    tipo: z.string(),
    localizacao: z.string()
});

export async function createCourtController(req: FastifyRequest, res: FastifyReply) {
    try {
        console.log('🔍 Iniciando criação de quadra...');
        
        const { nome, tipo, localizacao } = schemaCreateCourt.parse(req.body);
        console.log('Dados validados:', { nome, tipo, localizacao });
        const createCourtUseCase = makeCreateCourtUseCase();
        const result = await createCourtUseCase.execute({ nome, tipo, localizacao });
        console.log('✅:', result);

        return res.status(HttpStatusCode.Created).send(result);
    } catch (error) {
        console.error('❌ Erro detalhado no controller:', error);
        return res.status(HttpStatusCode.InternalServerError).send({ 
            message: "Erro ao criar quadra", 
            error: (error as Error).message 
        });
    }
}