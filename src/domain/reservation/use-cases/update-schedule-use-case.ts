import { Schedule } from "@prisma/client";
import { ScheduleRepository } from "../repositories/schedule-repository";

interface UpdateScheduleUseCaseRequest {
    id: string;
    dataHoraInicio?: Date;
    dataHoraFim?: Date;
    status?: string;
    user_id?: string;
    court_id?: string;
}

interface UpdateScheduleUseCaseResponse {
    schedule: Schedule;
}

export class UpdateScheduleUseCase {
    constructor(private scheduleRepository: ScheduleRepository) {}

    async execute({
        id,
        ...data
    }: UpdateScheduleUseCaseRequest): Promise<UpdateScheduleUseCaseResponse> {
        console.log('🔍 Use Case: Executando atualização da reserva');
        console.log('🔍 ID:', id);
        console.log('🔍 Dados:', data);

        const existingSchedule = await this.scheduleRepository.getScheduleById(id);
        if (!existingSchedule) {
            throw new Error('Reserva não encontrada');
        }

        console.log('✅ Reserva encontrada, procedendo com atualização');

        const schedule = await this.scheduleRepository.update(id, data);
        
        console.log('✅ Reserva atualizada com sucesso');
        return { schedule };
    }
}