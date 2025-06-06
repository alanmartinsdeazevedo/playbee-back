import { makeGetAllUsersUseCase } from "@/domain/user/@factories/make-getall-user-use-case";
import { FastifyRequest, FastifyReply } from "fastify";

export async function getAllUsersController(req: FastifyRequest, res: FastifyReply) {
    try {
        const getAllUsersUseCase = makeGetAllUsersUseCase();
        const users = await getAllUsersUseCase.execute();
        return res.status(200).send( users );
    } catch (error) {
        return res.status(400).send({
            message: "Erro ao buscar usuários",
            error: (error as Error).message
        });
    }
}
