import { Prisma } from "@prisma/client" 

export interface ScheduleParamsFunctionRepository{
    createSchedule: {
    dataHoraInicio: Date;
    dataHoraFim: Date;
    status: string;
    userId: string;
    courtId: string;
  };
    updateSchedule: Prisma.ScheduleUncheckedUpdateInput,
    findById: string
}