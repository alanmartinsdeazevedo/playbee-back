// src/domain/reservation/use-cases/create-schedule-use-case.ts

import { Schedule } from "@prisma/client";
import { ScheduleRepository } from "../repositories/schedule-repository";

interface CreateScheduleUseCaseRequest{
    dataHoraInicio: Date;
    dataHoraFim: Date;
    status: string;
    userId: string;
    courtId: string;
}

interface CreateScheduleUseCaseResponse{
    schedule: Schedule
}

export class CreateScheduleUseCase{
    constructor(private scheduleRepository: ScheduleRepository){}

    async execute(data: CreateScheduleUseCaseRequest): Promise<CreateScheduleUseCaseResponse>{
        try {
            const conflictingReservations = await this.scheduleRepository.findConflictingReservations(
                data.courtId,
                data.dataHoraInicio,
                data.dataHoraFim
            );

            if (conflictingReservations.length > 0) {
                console.log('❌ Use Case: Conflito encontrado:', conflictingReservations);
                throw new Error(`Já existe uma reserva para esta quadra no horário solicitado`);
            }

            console.log('✅ Use Case: Criando reserva sem verificação de conflito (temporário)');
            const schedule = await this.scheduleRepository.create(data);
            
            console.log('✅ Use Case: Reserva criada com sucesso:', schedule);
            return { schedule };
        } catch (error) {
            console.error('❌ Erro no CreateScheduleUseCase:', error);
            throw error;
        }
    }
}