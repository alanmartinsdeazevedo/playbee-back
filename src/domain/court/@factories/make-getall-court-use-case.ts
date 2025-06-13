import { PrismaCourtRepository } from "../repositories/prisma/prisma-court-repository";
import { GetAllCourtsUseCase } from "../use-cases/getall-court-use-case";



export function makeGetAllCourtsUseCase(){
    const courtRepository = new PrismaCourtRepository()
    return new GetAllCourtsUseCase(courtRepository)
}