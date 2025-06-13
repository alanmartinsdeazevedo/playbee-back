import { makeUpdateCourtUseCase } from "@/domain/court/@factories/make-update-court-use-case";
import { HttpStatusCode } from "axios";
import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";


const paramsSchema = z.object({
    id: z.string().uuid(),
})

const bodySchema = z.object({
    nome: z.string().optional(),
    tipo: z.string().optional(),
    localizacao: z.string().optional()
})

export async function updateCourtController(req: FastifyRequest, res: FastifyReply){
    try{
        const { id } = paramsSchema.parse(req.params);
    const data = bodySchema.parse(req.body);

    const updateCourtUseCase = makeUpdateCourtUseCase();
    const { court } = await updateCourtUseCase.execute({ id, ...data });

    return res.status(HttpStatusCode.Ok).send({court})
    } catch (error) {
        console.error("Erro ao atualizar quadra:", error);
    return res.status(HttpStatusCode.InternalServerError).send({
      message: "Erro ao atualizar quadra",
      error: (error as Error).message,
    });
    }
}