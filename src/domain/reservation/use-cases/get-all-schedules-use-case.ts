import { Schedule } from "@prisma/client";
import { ScheduleRepository } from "../repositories/schedule-repository";

interface GetAllSchedulesUseCaseRequest {
    userId?: string;
}

interface GetAllSchedulesUseCaseResponse {
    schedules: Schedule[];
}

export class GetAllSchedulesUseCase {
    constructor(private scheduleRepository: ScheduleRepository) {}

    async execute({ userId }: GetAllSchedulesUseCaseRequest): Promise<GetAllSchedulesUseCaseResponse> {
        try {
            console.log('🔍 Use Case: Buscando reservas, userId:', userId);
            
            let schedules: Schedule[];

            if (userId) {
                // Se userId foi fornecido, buscar apenas as reservas deste usuário
                schedules = await this.scheduleRepository.getSchedulesByUser(userId);
                console.log('✅ Use Case: Reservas do usuário encontradas:', schedules.length);
            } else {
                // Se não foi fornecido userId, buscar todas as reservas
                schedules = await this.scheduleRepository.getAllSchedules();
                console.log('✅ Use Case: Todas as reservas encontradas:', schedules.length);
            }

            return { schedules };
        } catch (error) {
            console.error('❌ Erro no GetAllSchedulesUseCase:', error);
            throw error;
        }
    }
}