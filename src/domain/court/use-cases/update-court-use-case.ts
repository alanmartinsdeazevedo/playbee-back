import { Court } from "@prisma/client";
import { CourtRepository } from "../repositories/court-repository";


interface UpdateCourtUseCaseRequest {
  id: string;
  nome?: string;
  tipo?: string;
  localizacao?: string;
}

interface UpdateCourtUseCaseResponse {
    court: Court
}

export class UpdateCourtUseCase {
    constructor(private courtRepository: CourtRepository) {}

    async execute({
        id,
        ...data
    }: UpdateCourtUseCaseRequest): Promise<UpdateCourtUseCaseResponse> {
        const court = await this.courtRepository.update(id,data)
        return { court }
    }
}