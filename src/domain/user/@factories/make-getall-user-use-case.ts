import { PrismaUserRepository } from "@/domain/user/repositories/prisma/prisma-user-repository";
import { GetAllUsersUseCase } from "@/domain/user/use-cases/getall-user-use-case";

export function makeGetAllUsersUseCase() {
  const userRepository = new PrismaUserRepository();
  return new GetAllUsersUseCase(userRepository);
}
