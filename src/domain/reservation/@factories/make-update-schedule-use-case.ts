import { PrismaScheduleRepository } from "../repositories/prisma/prisma-schedule-repository";
import { UpdateScheduleUseCase } from "../use-cases/update-schedule-use-case";
import { PrismaCourtRepository } from "../../court/repositories/prisma/prisma-court-repository";



export function makeUpdateScheduleUseCase() {
  const scheduleRepository = new PrismaScheduleRepository();
  const courtRepository = new PrismaCourtRepository();
  return new UpdateScheduleUseCase(scheduleRepository, courtRepository);
}
