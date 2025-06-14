import { CourtRepository } from "../repositories/court-repository";
import { CourtReturnFunctionRepository } from "../types/return/court";

interface GetCourtByIdUseCaseResponse {
    court: CourtReturnFunctionRepository["getCourt"];
}

export class GetCourtByIdUseCase {
    constructor(private courtRepository: CourtRepository) {}

    async execute(id: string): Promise<GetCourtByIdUseCaseResponse> {
        try {
            console.log('🔍 Use Case: Buscando quadra com ID:', id);
            
            const court = await this.courtRepository.getCourtById(id);
            
            if (!court) {
                throw new Error('Quadra não encontrada');
            }
            
            console.log('✅ Use Case: Quadra encontrada:', court.nome);
            return { court };
        } catch (error) {
            console.error('❌ Erro no GetCourtByIdUseCase:', error);
            throw error;
        }
    }
}