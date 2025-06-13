import { makeGetAllCourtsUseCase } from "@/domain/court/@factories/make-getall-court-use-case";
import { FastifyReply, FastifyRequest } from "fastify";



export async function getAllCourtsController(req: FastifyRequest, res: FastifyReply){
    try{
        const getAllCourtsUseCase = makeGetAllCourtsUseCase();
                const users = await getAllCourtsUseCase.execute();
                return res.status(200).send( users );
    }catch (error) {
        return res.status(400).send({
            message: "Erro ao buscar quadras",
            error: (error as Error).message
        });
    }
}