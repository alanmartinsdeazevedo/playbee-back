import { PrismaScheduleRepository } from "../repositories/prisma/prisma-schedule-repository";
import { CreateScheduleUseCase } from "../use-cases/create-schedule-use-case";


export function makeCreateScheduleUseCase(){
    const scheduleRepository = new PrismaScheduleRepository()
    return new CreateScheduleUseCase(scheduleRepository);
}