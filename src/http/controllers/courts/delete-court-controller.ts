import { makeDeleteCourtUseCase } from "@/domain/court/@factories/make-delete-court-use-case";
import { HttpStatusCode } from "axios";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";




const schemaParams = z.object({
    id: z.string().uuid()
})

export async function deleteCourtController(req: FastifyRequest, res: FastifyReply){
    const {id} = schemaParams.parse(req.params)

    try {
        const deleteCourtUseCase = makeDeleteCourtUseCase();
            await deleteCourtUseCase.execute( id );
        return res.status(HttpStatusCode.NoContent).send();
      }catch (error) {
    console.error("Erro ao deletar quadra:", error);
    return res.status(HttpStatusCode.InternalServerError).send({
      message: "Erro ao deletar quadra",
      error: (error as Error).message,
    });
  }
}