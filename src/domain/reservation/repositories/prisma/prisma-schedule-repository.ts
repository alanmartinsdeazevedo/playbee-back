import { prisma } from "@/lib/prisma";
import { ScheduleRepository } from "../schedule-repository";
import { ScheduleParamsFunctionRepository } from "../../types/params/schedule";
import { ScheduleReturnFunctionRepository } from "../../types/return/schedule";

export class PrismaScheduleRepository implements ScheduleRepository {
    async create(schedule: ScheduleParamsFunctionRepository["createSchedule"]): Promise<ScheduleReturnFunctionRepository["getSchedule"]> {
        try {
            const createdSchedule = await prisma.schedule.create({
                data: {
                    dataHoraInicio: schedule.dataHoraInicio,
                    dataHoraFim: schedule.dataHoraFim,
                    status: schedule.status,
                    user_id: schedule.userId,
                    court_id: schedule.courtId
                }
            });
            return createdSchedule;
        } catch (error) {
            console.error('❌ Repository: Erro ao criar reserva:', error);
            throw error;
        }
    }

    async update(id: string, data: ScheduleParamsFunctionRepository["updateSchedule"]): Promise<ScheduleReturnFunctionRepository["getSchedule"]> {
        try {
            console.log('🔍 Repository: Atualizando reserva:', { id, data });
            
            const updateData: any = {};
            
            if (data.dataHoraInicio) {
                updateData.dataHoraInicio = data.dataHoraInicio;
            }
            
            if (data.dataHoraFim) {
                updateData.dataHoraFim = data.dataHoraFim;
            }
            
            if (data.status) {
                updateData.status = data.status;
            }
            
            if (data.user_id) {
                updateData.user_id = data.user_id;
            }
            
            if (data.court_id) {
                updateData.court_id = data.court_id;
            }

            console.log('✅ Dados filtrados para atualização:', updateData);
            
            const updatedSchedule = await prisma.schedule.update({
                where: { id },
                data: updateData,
                include: {
                    user: {
                        select: {
                            id: true,
                            nome: true,
                            email: true
                        }
                    },
                    court: {
                        select: {
                            id: true,
                            nome: true,
                            tipo: true,
                            localizacao: true
                        }
                    }
                }
            });
            
            console.log('✅ Repository: Reserva atualizada com sucesso');
            return updatedSchedule;
        } catch (error) {
            console.error('❌ Repository: Erro ao atualizar reserva:', error);
            throw error;
        }
    }

    async getScheduleById(id: string): Promise<ScheduleReturnFunctionRepository["getSchedule"] | null> {
        try {
            console.log('🔍 Repository: Buscando reserva por ID:', id);
            
            // Validar se o ID é um UUID válido
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(id)) {
                console.log('❌ Repository: ID inválido (não é UUID):', id);
                return null;
            }
            
            const schedule = await prisma.schedule.findUnique({
                where: { id },
                include: {
                    user: {
                        select: {
                            id: true,
                            nome: true,
                            email: true
                        }
                    },
                    court: {
                        select: {
                            id: true,
                            nome: true,
                            tipo: true,
                            localizacao: true
                        }
                    }
                }
            });
            
            if (schedule) {
                console.log('✅ Repository: Reserva encontrada:', {
                    id: schedule.id,
                    status: schedule.status,
                    court: schedule.court?.nome,
                    user: schedule.user?.nome
                });
            } else {
                console.log('❌ Repository: Reserva não encontrada para ID:', id);
            }
            
            return schedule;
        } catch (error) {
            console.error('❌ Repository: Erro ao buscar reserva por ID:', error);
            
            // Se for erro específico do Prisma
            if (error instanceof Error) {
                if (error.message.includes('Invalid `prisma.schedule.findUnique()`')) {
                    console.error('❌ Erro específico do Prisma:', error.message);
                    throw new Error('Erro ao buscar reserva no banco de dados');
                }
            }
            
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            console.log('🔍 Repository: Deletando reserva com ID:', id);
            
            // Verificar se a reserva existe primeiro
            const existingSchedule = await this.getScheduleById(id);
            if (!existingSchedule) {
                throw new Error('Reserva não encontrada');
            }
            
            await prisma.schedule.delete({
                where: { id }
            });
            
            console.log('✅ Repository: Reserva deletada com sucesso');
        } catch (error) {
            console.error('❌ Repository: Erro ao deletar reserva:', error);
            throw error;
        }
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
                include: {
                    user: {
                        select: {
                            id: true,
                            nome: true,
                            email: true
                        }
                    },
                    court: {
                        select: {
                            id: true,
                            nome: true,
                            tipo: true,
                            localizacao: true
                        }
                    }
                },
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
                include: {
                    user: {
                        select: {
                            id: true,
                            nome: true,
                            email: true
                        }
                    },
                    court: {
                        select: {
                            id: true,
                            nome: true,
                            tipo: true,
                            localizacao: true
                        }
                    }
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

    async findUserReservationsByCourtTypeAndDate(
        userId: string, 
        courtType: string, 
        date: Date, 
        excludeId?: string
    ): Promise<ScheduleReturnFunctionRepository["getSchedule"][]> {
        try {
            console.log('🔍 Repository: Verificando reservas do usuário no mesmo dia:', { userId, courtType, date });
            
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            
            const reservations = await prisma.schedule.findMany({
                where: {
                    user_id: userId,
                    id: excludeId ? { not: excludeId } : undefined,
                    status: {
                        notIn: ['cancelado', 'cancelled']
                    },
                    dataHoraInicio: {
                        gte: startOfDay,
                        lte: endOfDay
                    },
                    court: {
                        tipo: courtType
                    }
                },
                include: {
                    court: {
                        select: {
                            id: true,
                            nome: true,
                            tipo: true,
                            localizacao: true
                        }
                    }
                }
            });
            
            console.log('✅ Repository: Reservas encontradas do mesmo tipo no dia:', reservations.length);
            return reservations;
        } catch (error) {
            console.error('❌ Repository: Erro ao verificar reservas do usuário no mesmo dia:', error);
            throw error;
        }
    }

    async countActiveReservationsByUser(userId: string): Promise<number> {
        try {
            console.log('🔍 Repository: Contando reservas ativas do usuário:', userId);
            
            const now = new Date();
            const activeCount = await prisma.schedule.count({
                where: {
                    user_id: userId,
                    status: {
                        notIn: ['cancelado', 'cancelled']
                    },
                    dataHoraFim: {
                        gte: now // Reservas que ainda não terminaram
                    }
                }
            });
            
            console.log('✅ Repository: Reservas ativas encontradas:', activeCount);
            return activeCount;
        } catch (error) {
            console.error('❌ Repository: Erro ao contar reservas ativas:', error);
            throw error;
        }
    }
}