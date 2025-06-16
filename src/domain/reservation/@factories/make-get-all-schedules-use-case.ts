import { PrismaScheduleRepository } from "../repositories/prisma/prisma-schedule-repository";
import { GetAllSchedulesUseCase } from "../use-cases/get-all-schedules-use-case";

export function makeGetAllSchedulesUseCase() {
  const scheduleRepository = new PrismaScheduleRepository();
  return new GetAllSchedulesUseCase(scheduleRepository);
}