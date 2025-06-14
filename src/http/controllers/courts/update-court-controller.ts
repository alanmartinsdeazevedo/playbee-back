import { makeUpdateCourtUseCase } from "@/domain/court/@factories/make-update-court-use-case";
import { HttpStatusCode } from "axios";
import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";

const paramsSchema = z.object({
    id: z.string().uuid(),
});

const bodySchema = z.object({
    nome: z.string().optional(),
    tipo: z.string().optional(),
    localizacao: z.string().optional()
});

export async function updateCourtController(req: FastifyRequest, res: FastifyReply) {
    try {
        console.log('🔍 Iniciando atualização de quadra...');
        
        const { id } = paramsSchema.parse(req.params);
        const data = bodySchema.parse(req.body);
        console.log('✅ Dados validados:', { id, data });

        const updateCourtUseCase = makeUpdateCourtUseCase();
        console.log('✅ Use Case criado');

        const result = await updateCourtUseCase.execute({ id, ...data });
        console.log('✅ Resultado do Use Case:', result);

        // O Use Case retorna { court }, então enviamos direto
        return res.status(HttpStatusCode.Ok).send(result);
    } catch (error) {
        console.error('❌ Erro detalhado no controller:', error);
        return res.status(HttpStatusCode.InternalServerError).send({
            message: "Erro ao atualizar quadra",
            error: (error as Error).message,
        });
    }
}