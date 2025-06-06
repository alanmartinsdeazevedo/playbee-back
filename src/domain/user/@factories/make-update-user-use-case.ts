import { PrismaUserRepository } from "@/domain/user/repositories/prisma/prisma-user-repository";
import { UpdateUserUseCase } from "../use-cases/update-user-use-case";

export function makeUpdateUserUseCase() {
  const userRepository = new PrismaUserRepository();
  return new UpdateUserUseCase(userRepository);
}
