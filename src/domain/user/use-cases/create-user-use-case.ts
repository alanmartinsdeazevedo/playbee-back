import { User } from "@prisma/client";
import { UserRepository } from "../repositories/user-repository";
import bcrypt from "bcryptjs";

interface CreateUserUseCaseRequest {
    nome: string;
    email: string;
    senha: string;
    telefone: string;
    role: string;
}

interface CreateUserUseCaseResponse {
  user: Omit<User, 'senha'>; // Retornar sem senha
}

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    
    if (existingUser) {
      throw new Error("Este email já está em uso");
    }

    const hashedPassword = await bcrypt.hash(data.senha, 10);

    const user = await this.userRepository.create({
      ...data,
      senha: hashedPassword
    });

    const { senha: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword };
  }
}