import { ScheduleParamsFunctionRepository } from "../types/params/schedule";
import { ScheduleReturnFunctionRepository } from "../types/return/schedule";

export interface ScheduleRepository{
    create(schedule: ScheduleParamsFunctionRepository["createSchedule"]): Promise<ScheduleReturnFunctionRepository["getSchedule"]>
    update(id: string, data: ScheduleParamsFunctionRepository["updateSchedule"]): Promise<ScheduleReturnFunctionRepository["getSchedule"]>
    getScheduleById(id: string): Promise<ScheduleReturnFunctionRepository["getSchedule"] | null>
    delete(id: string): Promise<void>
    findConflictingReservations(courtId: string, dataHoraInicio: Date, dataHoraFim: Date, excludeId?: string): Promise<ScheduleReturnFunctionRepository["getSchedule"][]>
    getAllSchedules(): Promise<ScheduleReturnFunctionRepository["getSchedule"][]>
    getSchedulesByUser(userId: string): Promise<ScheduleReturnFunctionRepository["getSchedule"][]>
    findUserReservationsByCourtTypeAndDate(userId: string, courtType: string, date: Date, excludeId?: string): Promise<ScheduleReturnFunctionRepository["getSchedule"][]>
    countActiveReservationsByUser(userId: string): Promise<number>
}