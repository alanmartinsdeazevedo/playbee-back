import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { makeDeleteUserUseCase } from "@/domain/user/@factories/make-delete-user-use-case"; 
import { HttpStatusCode } from "axios";

const schemaParams = z.object({
  id: z.string().uuid(),
});

export async function deleteUserController(req: FastifyRequest, res: FastifyReply) {
  const { id } = schemaParams.parse(req.params);

  try {
    const deleteUserUseCase = makeDeleteUserUseCase();
        await deleteUserUseCase.execute( id );
    return res.status(HttpStatusCode.NoContent).send();
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    return res.status(HttpStatusCode.InternalServerError).send({
      message: "Erro ao deletar usuário",
      error: (error as Error).message,
    });
  }
}
