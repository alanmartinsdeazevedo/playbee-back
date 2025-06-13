import { PrismaCourtRepository } from "../repositories/prisma/prisma-court-repository";
import { UpdateCourtUseCase } from "../use-cases/update-court-use-case";



export function makeUpdateCourtUseCase(){
    const courtRepository = new PrismaCourtRepository()
    return new UpdateCourtUseCase(courtRepository)
}