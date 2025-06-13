import { Court } from "@prisma/client";
import { CourtRepository } from "../repositories/court-repository";



interface GetAllCourtsUseCaseResponse{
    courts: Court[];
}

export class GetAllCourtsUseCase{
    constructor(private courtRepository: CourtRepository){}

    async execute(): Promise<GetAllCourtsUseCaseResponse>{
        const courts = await this.courtRepository.getAllCourts()
        return { courts }
    }
}