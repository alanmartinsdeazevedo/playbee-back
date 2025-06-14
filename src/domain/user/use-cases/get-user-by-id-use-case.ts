import { User } from "@prisma/client";
import { UserRepository } from "../repositories/user-repository";

interface GetUserByIdUseCaseResponse {
    user: Omit<User, 'senha'>;
}

export class GetUserByIdUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(id: string): Promise<GetUserByIdUseCaseResponse> {
        try {
            console.log('🔍 Use Case: Buscando usuário com ID:', id);
            
            const user = await this.userRepository.findById(id);
            
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            
            console.log('✅ Use Case: Usuário encontrado:', user.nome);

            // Remover senha da resposta
            const { senha: _, ...userWithoutPassword } = user;
            
            return { user: userWithoutPassword };
        } catch (error) {
            console.error('❌ Erro no GetUserByIdUseCase:', error);
            throw error;
        }
    }
}