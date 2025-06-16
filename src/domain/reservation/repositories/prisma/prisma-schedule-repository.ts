import { prisma } from "@/lib/prisma";
import { ScheduleRepository } from "../schedule-repository";
import { ScheduleParamsFunctionRepository } from "../../types/params/schedule";
import { ScheduleReturnFunctionRepository } from "../../types/return/schedule";

export class PrismaScheduleRepository implements ScheduleRepository {
    async create(schedule: ScheduleParamsFunctionRepository["createSchedule"]): Promise<ScheduleReturnFunctionRepository["getSchedule"]> {
        try {
            console.log('🔍 Repository: Criando reserva:', schedule);
            
            const createdSchedule = await prisma.schedule.create({
                data: {
                    dataHoraInicio: schedule.dataHoraInicio,
                    dataHoraFim: schedule.dataHoraFim,
                    status: schedule.status,
                    user_id: schedule.userId,
                    court_id: schedule.courtId
                }
            });
            
            console.log('✅ Repository: Reserva criada:', createdSchedule);
            return createdSchedule;
        } catch (error) {
            console.error('❌ Repository: Erro ao criar reserva:', error);
            throw error;
        }
    }

    async update(id: string, data: ScheduleParamsFunctionRepository["updateSchedule"]): Promise<ScheduleReturnFunctionRepository["getSchedule"]> {
        const updatedSchedule = await prisma.schedule.update({
            where: { id },
            data: {
                ...data
            }
        });
        return updatedSchedule;
    }

    async getScheduleById(id: string): Promise<ScheduleReturnFunctionRepository["getSchedule"] | null> {
        const schedule = await prisma.schedule.findUnique({
            where: { id },
        });
        return schedule;
    }

    async delete(id: string): Promise<void> {
        await prisma.schedule.delete({
            where: { id }
        });
    }

    async findConflictingReservations(
        courtId: string, 
        dataHoraInicio: Date, 
        dataHoraFim: Date, 
        excludeId?: string
    ): Promise<ScheduleReturnFunctionRepository["getSchedule"][]> {
        try {
            console.log('🔍 Repository: Verificando conflitos para quadra:', courtId);
            console.log('🔍 Período:', { dataHoraInicio, dataHoraFim, excludeId });
            
            const conflictingReservations = await prisma.schedule.findMany({
                where: {
                    court_id: courtId,
                    id: excludeId ? { not: excludeId } : undefined,
                    status: {
                        notIn: ['cancelado', 'cancelled']
                    },
                    OR: [
                        // Nova reserva começa durante uma existente
                        {
                            AND: [
                                { dataHoraInicio: { lte: dataHoraInicio } },
                                { dataHoraFim: { gt: dataHoraInicio } }
                            ]
                        },
                        // Nova reserva termina durante uma existente  
                        {
                            AND: [
                                { dataHoraInicio: { lt: dataHoraFim } },
                                { dataHoraFim: { gte: dataHoraFim } }
                            ]
                        },
                        // Nova reserva engloba uma existente
                        {
                            AND: [
                                { dataHoraInicio: { gte: dataHoraInicio } },
                                { dataHoraFim: { lte: dataHoraFim } }
                            ]
                        },
                        // Reserva existente engloba a nova
                        {
                            AND: [
                                { dataHoraInicio: { lte: dataHoraInicio } },
                                { dataHoraFim: { gte: dataHoraFim } }
                            ]
                        }
                    ]
                }
            });
            
            console.log('🔍 Repository: Conflitos encontrados:', conflictingReservations.length);
            return conflictingReservations;
        } catch (error) {
            console.error('❌ Repository: Erro ao verificar conflitos:', error);
            throw error;
        }
    }

    async getAllSchedules(): Promise<ScheduleReturnFunctionRepository["getSchedule"][]> {
        try {
            console.log('🔍 Repository: Buscando todas as reservas...');
            
            const schedules = await prisma.schedule.findMany({
                orderBy: {
                    dataHoraInicio: 'desc'
                }
            });
            
            console.log('✅ Repository: Reservas encontradas:', schedules.length);
            return schedules;
        } catch (error) {
            console.error('❌ Repository: Erro ao buscar todas as reservas:', error);
            throw error;
        }
    }

    async getSchedulesByUser(userId: string): Promise<ScheduleReturnFunctionRepository["getSchedule"][]> {
        try {
            console.log('🔍 Repository: Buscando reservas do usuário:', userId);
            
            const schedules = await prisma.schedule.findMany({
                where: {
                    user_id: userId
                },
                orderBy: {
                    dataHoraInicio: 'desc'
                }
            });
            
            console.log('✅ Repository: Reservas do usuário encontradas:', schedules.length);
            return schedules;
        } catch (error) {
            console.error('❌ Repository: Erro ao buscar reservas do usuário:', error);
            throw error;
        }
    }
}