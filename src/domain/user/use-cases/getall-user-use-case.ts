import { User } from "@prisma/client";
import { UserRepository } from "../repositories/user-repository";

interface GetAllUsersUseCaseResponse {
  users: User[];
}

export class GetAllUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<GetAllUsersUseCaseResponse> {
    const users = await this.userRepository.getAllUsers();
    return { users };
  }
}
