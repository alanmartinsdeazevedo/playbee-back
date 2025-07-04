import { PrismaScheduleRepository } from "../repositories/prisma/prisma-schedule-repository";
import { CreateScheduleUseCase } from "../use-cases/create-schedule-use-case";
import { PrismaCourtRepository } from "../../court/repositories/prisma/prisma-court-repository";


export function makeCreateScheduleUseCase(){
    const scheduleRepository = new PrismaScheduleRepository()
    const courtRepository = new PrismaCourtRepository()
    return new CreateScheduleUseCase(scheduleRepository, courtRepository);
}