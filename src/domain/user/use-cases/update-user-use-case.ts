import { User } from "@prisma/client";
import { UserRepository } from "../repositories/user-repository";

interface UpdateUserUseCaseRequest {
  id: string;
  nome?: string;
  email?: string;
  senha?: string;
  telefone?: string;
  role?: string;
}

interface UpdateUserUseCaseResponse {
  user: User;
}

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    id,
    ...data
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const user = await this.userRepository.update(id, data);
    return { user };
  }
}
