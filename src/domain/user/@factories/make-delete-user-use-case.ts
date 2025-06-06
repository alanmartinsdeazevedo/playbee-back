import { PrismaUserRepository } from "@/domain/user/repositories/prisma/prisma-user-repository";
import { DeleteUserUseCase } from "../use-cases/delete-user-use-case";

export function makeDeleteUserUseCase() {
  const userRepository = new PrismaUserRepository();
  return new DeleteUserUseCase(userRepository);
}
