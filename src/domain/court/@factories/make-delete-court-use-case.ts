import { PrismaCourtRepository } from "../repositories/prisma/prisma-court-repository";
import { DeleteCourtUseCase } from "../use-cases/delete-court-use-case";



export function makeDeleteCourtUseCase(){
    const courtRepository = new PrismaCourtRepository()
    return new DeleteCourtUseCase(courtRepository);
    }