import { CourtRepository } from "../repositories/court-repository";


interface DeleteCourtUseCaseRequest{
    id: string
}

export class DeleteCourtUseCase{
    constructor(private courtRepository: CourtRepository) {}

    async execute(id: string): Promise<void> {
        await this.courtRepository.delete(id)
    }
}