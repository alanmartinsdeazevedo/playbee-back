import { PrismaCourtRepository } from "../repositories/prisma/prisma-court-repository";
import { GetCourtByIdUseCase } from "../use-cases/get-court-by-id-use-case";

export function makeGetCourtByIdUseCase() {
  const courtRepository = new PrismaCourtRepository();
  return new GetCourtByIdUseCase(courtRepository);
}