import { ScheduleParamsFunctionRepository } from "../types/params/schedule";
import { ScheduleReturnFunctionRepository } from "../types/return/schedule";



export interface ScheduleRepository{
    create(schedule: ScheduleParamsFunctionRepository["createSchedule"]): Promise<ScheduleReturnFunctionRepository["getSchedule"]>
    update(id: string, data: ScheduleParamsFunctionRepository["updateSchedule"]): Promise<ScheduleReturnFunctionRepository["getSchedule"]>
    getScheduleById(id: string): Promise<ScheduleReturnFunctionRepository["getSchedule"] | null>
    delete(id: string): Promise<void>;
}