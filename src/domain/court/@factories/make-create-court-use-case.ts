import { PrismaCourtRepository } from "../repositories/prisma/prisma-court-repository";
import { CreateCourtUseCase } from "../use-cases/create-court-use-case";



export function makeCreateCourtUseCase(){
    const courtRepository = new PrismaCourtRepository()
    return new CreateCourtUseCase(courtRepository)
}