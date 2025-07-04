import { Schedule } from "@prisma/client";
import { ScheduleRepository } from "../repositories/schedule-repository";
import { CourtRepository } from "../../court/repositories/court-repository";

interface UpdateScheduleUseCaseRequest {
    id: string;
    dataHoraInicio?: Date;
    dataHoraFim?: Date;
    status?: string;
    user_id?: string;
    court_id?: string;
    userId?: string; // Para validação de permissão
}

interface UpdateScheduleUseCaseResponse {
    schedule: Schedule;
}

export class UpdateScheduleUseCase {
    constructor(
        private scheduleRepository: ScheduleRepository,
        private courtRepository: CourtRepository
    ) {}

    async execute({
        id,
        userId,
        ...data
    }: UpdateScheduleUseCaseRequest): Promise<UpdateScheduleUseCaseResponse> {
        console.log('🔍 Use Case: Executando atualização da reserva');
        console.log('🔍 ID:', id);
        console.log('🔍 Dados:', data);

        const existingSchedule = await this.scheduleRepository.getScheduleById(id);
        if (!existingSchedule) {
            throw new Error('Reserva não encontrada');
        }

        // Verificar se o usuário tem permissão para editar esta reserva
        if (userId && existingSchedule.user_id !== userId) {
            throw new Error('Você só pode editar suas próprias reservas');
        }

        // Verificar se a reserva já começou
        const now = new Date();
        if (existingSchedule.dataHoraInicio <= now) {
            throw new Error('Não é possível editar uma reserva que já começou');
        }

        // Se estiver alterando dados de horário ou quadra, fazer validações adicionais
        if (data.dataHoraInicio || data.dataHoraFim || data.court_id) {
            const courtId = data.court_id || existingSchedule.court_id;
            const dataHoraInicio = data.dataHoraInicio || existingSchedule.dataHoraInicio;
            const dataHoraFim = data.dataHoraFim || existingSchedule.dataHoraFim;

            // Verificar conflitos de horário
            const conflictingReservations = await this.scheduleRepository.findConflictingReservations(
                courtId,
                dataHoraInicio,
                dataHoraFim,
                id // Excluir a própria reserva da verificação
            );

            if (conflictingReservations.length > 0) {
                throw new Error('Já existe uma reserva para esta quadra no horário solicitado');
            }

            // Se mudou a quadra ou a data, verificar se não há conflito com regra de mesmo tipo
            if (data.court_id || data.dataHoraInicio) {
                const court = await this.courtRepository.getCourtById(courtId);
                if (!court) {
                    throw new Error("Quadra não encontrada");
                }

                const existingReservations = await this.scheduleRepository.findUserReservationsByCourtTypeAndDate(
                    existingSchedule.user_id,
                    court.tipo,
                    dataHoraInicio,
                    id // Excluir a própria reserva da verificação
                );

                if (existingReservations.length > 0) {
                    throw new Error(`Você já possui uma reserva de ${court.tipo} para este dia`);
                }
            }
        }

        console.log('✅ Reserva encontrada, procedendo com atualização');

        const schedule = await this.scheduleRepository.update(id, data);
        
        console.log('✅ Reserva atualizada com sucesso');
        return { schedule };
    }
}