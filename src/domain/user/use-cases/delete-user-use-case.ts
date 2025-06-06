import { UserRepository } from "../repositories/user-repository";

interface DeleteUserUseCaseRequest {
  id: string;
}

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute( id : string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
