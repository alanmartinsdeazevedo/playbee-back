import { PrismaScheduleRepository } from "../repositories/prisma/prisma-schedule-repository";
import { GetScheduleUseCase } from "../use-cases/get-schedule-use-case";


export function makeGetScheduleUseCase() {
  const scheduleRepository = new PrismaScheduleRepository();
  return new GetScheduleUseCase(scheduleRepository);
}
