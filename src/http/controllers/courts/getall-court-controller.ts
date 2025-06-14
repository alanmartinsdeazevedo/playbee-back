import { makeGetAllCourtsUseCase } from "@/domain/court/@factories/make-getall-court-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

export async function getAllCourtsController(req: FastifyRequest, res: FastifyReply){
    try{
        console.log('🔍 Iniciando busca de quadras...');
        
        const getAllCourtsUseCase = makeGetAllCourtsUseCase();        
        const result = await getAllCourtsUseCase.execute(); 
        console.log('[GetAll]:', result);
        
        return res.status(200).send(result);
    }catch (error) {
        console.error('❌ Erro detalhado no controller:', error);
        return res.status(400).send({
            message: "Erro ao buscar quadras",
            error: (error as Error).message
        });
    }
}