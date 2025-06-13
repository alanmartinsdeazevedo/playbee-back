import { makeCreateCourtUseCase } from "@/domain/court/@factories/make-create-court-use-case";
import { PrismaCourtRepository } from "@/domain/court/repositories/prisma/prisma-court-repository";
import { CreateCourtUseCase} from "@/domain/court/use-cases/create-court-use-case";
import { HttpStatusCode } from "axios";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export const schemaCreateCourt = z.object({
    nome: z.string(),
    tipo: z.string(),
    localizacao: z.string()
})

export async function createCourtController(req: FastifyRequest, res: FastifyReply){

    const{nome, tipo, localizacao } = schemaCreateCourt.parse(req.body)

    console.log(nome, tipo)
    try {
        const createCourtUseCase = makeCreateCourtUseCase()

        const court = await createCourtUseCase.execute({nome, tipo, localizacao});

        return res.status(HttpStatusCode.Created).send({court});
    }catch (error){
        console.error('Erro ao criar quadra:', error);
        return res.status(HttpStatusCode.InternalServerError).send({ message: "Erro ao criar quadra", error: (error as Error).message });
    }
}