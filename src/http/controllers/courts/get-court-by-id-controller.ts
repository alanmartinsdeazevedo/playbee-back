import { makeGetCourtByIdUseCase } from "@/domain/court/@factories/make-get-court-by-id-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpStatusCode } from "axios";

const schemaParams = z.object({
    id: z.string().uuid()
});

export async function getCourtByIdController(req: FastifyRequest, res: FastifyReply) {
    try {
        console.log('🔍 Iniciando busca de quadra por ID...');
        
        const { id } = schemaParams.parse(req.params);
        console.log('✅ ID validado:', id);

        const getCourtByIdUseCase = makeGetCourtByIdUseCase();
        console.log('✅ Use Case criado');

        const result = await getCourtByIdUseCase.execute(id);
        console.log('✅ Resultado do Use Case:', result);

        // O Use Case retorna { court }, então enviamos direto
        return res.status(HttpStatusCode.Ok).send(result);
    } catch (error) {
        console.error('❌ Erro detalhado no controller:', error);
        
        // Verificar se é erro de quadra não encontrada
        if (error instanceof Error && error.message.includes('não encontrada')) {
            return res.status(HttpStatusCode.NotFound).send({
                message: "Quadra não encontrada",
                error: error.message,
            });
        }

        return res.status(HttpStatusCode.InternalServerError).send({
            message: "Erro ao buscar quadra",
            error: (error as Error).message,
        });
    }
}