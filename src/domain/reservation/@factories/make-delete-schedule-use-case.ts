import { PrismaScheduleRepository } from "../repositories/prisma/prisma-schedule-repository";
import { DeleteScheduleUseCase } from "../use-cases/delete-schedule-use-case";


export function makeDeleteScheduleUseCase() {
  const scheduleRepository = new PrismaScheduleRepository();
  return new DeleteScheduleUseCase(scheduleRepository);
}
