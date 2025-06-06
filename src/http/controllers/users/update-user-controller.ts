import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { makeUpdateUserUseCase } from "@/domain/user/@factories/make-update-user-use-case";
import { HttpStatusCode } from "axios";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const bodySchema = z.object({
  nome: z.string().optional(),
  email: z.string().email().optional(),
  senha: z.string().min(6).optional(),
  telefone: z.string().optional(),
  role: z.string().optional(),
});

export async function updateUserController(req: FastifyRequest, res: FastifyReply) {
  try {
    const { id } = paramsSchema.parse(req.params);
    const data = bodySchema.parse(req.body);

    const updateUserUseCase = makeUpdateUserUseCase();
    const { user } = await updateUserUseCase.execute({ id, ...data });

    return res.status(HttpStatusCode.Ok).send({ user });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return res.status(HttpStatusCode.InternalServerError).send({
      message: "Erro ao atualizar usuário",
      error: (error as Error).message,
    });
  }
}
