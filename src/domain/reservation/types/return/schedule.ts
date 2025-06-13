import { Schedule } from "@prisma/client";


export interface ScheduleReturnFunctionRepository{
    getSchedule: Schedule
}