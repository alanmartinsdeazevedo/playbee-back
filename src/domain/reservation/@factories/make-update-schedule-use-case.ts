import { PrismaScheduleRepository } from "../repositories/prisma/prisma-schedule-repository";
import { UpdateScheduleUseCase } from "../use-cases/update-schedule-use-case";



export function makeUpdateScheduleUseCase() {
  const scheduleRepository = new PrismaScheduleRepository();
  return new UpdateScheduleUseCase(scheduleRepository);
}
