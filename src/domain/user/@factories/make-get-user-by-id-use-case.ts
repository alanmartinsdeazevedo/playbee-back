import { PrismaUserRepository } from "../repositories/prisma/prisma-user-repository";
import { GetUserByIdUseCase } from "../use-cases/get-user-by-id-use-case";

export function makeGetUserByIdUseCase() {
  const userRepository = new PrismaUserRepository();
  return new GetUserByIdUseCase(userRepository);
}