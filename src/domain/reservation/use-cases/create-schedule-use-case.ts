// src/domain/reservation/use-cases/create-schedule-use-case.ts

import { Schedule } from "@prisma/client";
import { ScheduleRepository } from "../repositories/schedule-repository";
import { CourtRepository } from "../../court/repositories/court-repository";

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
    constructor(
        private scheduleRepository: ScheduleRepository,
        private courtRepository: CourtRepository
    ){}

    async execute(data: CreateScheduleUseCaseRequest): Promise<CreateScheduleUseCaseResponse>{
        try {
            // Verificar se a quadra existe
            const court = await this.courtRepository.getCourtById(data.courtId);
            if (!court) {
                throw new Error("Quadra não encontrada");
            }

            // Verificar conflitos de horário na mesma quadra
            const conflictingReservations = await this.scheduleRepository.findConflictingReservations(
                data.courtId,
                data.dataHoraInicio,
                data.dataHoraFim
            );

            if (conflictingReservations.length > 0) {
                console.log('❌ Use Case: Conflito encontrado:', conflictingReservations);
                throw new Error(`Já existe uma reserva para esta quadra no horário solicitado`);
            }

            // Verificar se o usuário já tem reserva do mesmo tipo de quadra no mesmo dia
            const existingReservations = await this.scheduleRepository.findUserReservationsByCourtTypeAndDate(
                data.userId,
                court.tipo,
                data.dataHoraInicio
            );

            if (existingReservations.length > 0) {
                console.log('❌ Use Case: Usuário já tem reserva do mesmo tipo no dia:', existingReservations);
                throw new Error(`Você já possui uma reserva de ${court.tipo} para este dia`);
            }

            console.log('✅ Use Case: Criando reserva');
            const schedule = await this.scheduleRepository.create(data);
            
            console.log('✅ Use Case: Reserva criada com sucesso:', schedule);
            return { schedule };
        } catch (error) {
            console.error('❌ Erro no CreateScheduleUseCase:', error);
            throw error;
        }
    }
}