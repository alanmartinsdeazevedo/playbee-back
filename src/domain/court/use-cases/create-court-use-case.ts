import { Court } from "@prisma/client";
import { CourtRepository } from "../repositories/court-repository";



interface CreateCourtUseCaseRequest {
    nome: string;
    tipo: string;
    localizacao: string;
}
interface CreateCourtUseCaseResponse {
    court: Court
}


export class CreateCourtUseCase {
    constructor(private courtRepository: CourtRepository){}

    async execute(data: CreateCourtUseCaseRequest): Promise<CreateCourtUseCaseResponse>{
        const court = await this.courtRepository.create(data)
        return {court}
    }
}