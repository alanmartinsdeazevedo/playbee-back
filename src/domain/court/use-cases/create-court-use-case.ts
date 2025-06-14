import { CourtRepository } from "../repositories/court-repository";
import { CourtParamsFunctionRepository } from "../types/params/court";
import { CourtReturnFunctionRepository } from "../types/return/court";

interface CreateCourtUseCaseRequest {
    nome: string;
    tipo: string;
    localizacao: string;
}

interface CreateCourtUseCaseResponse {
    court: CourtReturnFunctionRepository["getCourt"];
}

export class CreateCourtUseCase {
    constructor(private courtRepository: CourtRepository) {}

    async execute(data: CreateCourtUseCaseRequest): Promise<CreateCourtUseCaseResponse> {
        try {
            console.log('🔍 Criando quadra no Use Case:', data);
            
            const court = await this.courtRepository.create(data);
            console.log('✅ Quadra criada no Use Case:', court);
            
            return { court };
        } catch (error) {
            console.error('❌ Erro no CreateCourtUseCase:', error);
            throw new Error('Erro ao criar quadra');
        }
    }
}