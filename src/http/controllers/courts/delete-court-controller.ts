import { makeDeleteCourtUseCase } from "@/domain/court/@factories/make-delete-court-use-case";
import { HttpStatusCode } from "axios";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const schemaParams = z.object({
    id: z.string().uuid()
});

export async function deleteCourtController(req: FastifyRequest, res: FastifyReply) {
    try {
        console.log('🔍 Iniciando exclusão de quadra...');
        
        const { id } = schemaParams.parse(req.params);
        console.log('✅ ID validado:', id);

        const deleteCourtUseCase = makeDeleteCourtUseCase();
        console.log('✅ Use Case criado');

        await deleteCourtUseCase.execute(id);
        console.log('✅ Quadra excluída com sucesso');

        return res.status(HttpStatusCode.NoContent).send();
    } catch (error) {
        console.error('❌ Erro detalhado no controller:', error);
        
        // Verificar se é erro de registro não encontrado
        if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
            return res.status(HttpStatusCode.NotFound).send({
                message: "Quadra não encontrada",
                error: error.message,
            });
        }

        return res.status(HttpStatusCode.InternalServerError).send({
            message: "Erro ao deletar quadra",
            error: (error as Error).message,
        });
    }
}