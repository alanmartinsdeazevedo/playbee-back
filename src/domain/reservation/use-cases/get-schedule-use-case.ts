import { Schedule } from "@prisma/client";
import { ScheduleRepository } from "../repositories/schedule-repository";

interface GetScheduleUseCaseRequest{
    id: string;
}

interface GetScheduleUseCaseResponse {
    scheduling: Schedule | null;
}

export class GetScheduleUseCase{
    constructor (private scheduleRepository: ScheduleRepository){}

    async execute(id: string): Promise<GetScheduleUseCaseResponse> {
        try {
            console.log('🔍 Use Case: Buscando reserva com ID:', id);
            
            // Validar se o ID foi fornecido
            if (!id || id.trim() === '') {
                throw new Error('ID da reserva é obrigatório');
            }
            
            const scheduling = await this.scheduleRepository.getScheduleById(id);
            
            if (scheduling) {
                console.log('✅ Use Case: Reserva encontrada:', {
                    id: scheduling.id,
                    status: scheduling.status,
                    dataHoraInicio: scheduling.dataHoraInicio,
                    dataHoraFim: scheduling.dataHoraFim
                });
            } else {
                console.log('❌ Use Case: Reserva não encontrada para ID:', id);
            }
            
            return { scheduling };
        } catch (error) {
            console.error('❌ Erro no GetScheduleUseCase:', error);
            
            // Se for erro de banco/prisma, dar uma mensagem mais específica
            if (error instanceof Error) {
                if (error.message.includes('Invalid `prisma')) {
                    throw new Error('Erro ao acessar banco de dados');
                }
                
                if (error.message.includes('Record to')) {
                    throw new Error('Reserva não encontrada');
                }
            }
            
            throw error;
        }
    }
}