import { CourtRepository } from "../repositories/court-repository";

export class DeleteCourtUseCase {
    constructor(private courtRepository: CourtRepository) {}

    async execute(id: string): Promise<void> {
        try {
            console.log('🔍 Use Case: Deletando quadra com ID:', id);
            
            await this.courtRepository.delete(id);
            
            console.log('✅ Use Case: Quadra deletada com sucesso');
        } catch (error) {
            console.error('❌ Erro no DeleteCourtUseCase:', error);
            throw error; // Repassa o erro para o controller tratar
        }
    }
}