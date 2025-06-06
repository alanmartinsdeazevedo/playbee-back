import { User } from "@prisma/client";
import { UserRepository } from "../repositories/user-repository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface LoginUserUseCaseRequest {
  email: string;
  senha: string;
}

interface LoginUserUseCaseResponse {
  user: Omit<User, 'senha'>;
  token: string;
}

export class LoginUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ email, senha }: LoginUserUseCaseRequest): Promise<LoginUserUseCaseResponse> {
    // Buscar usuário por email
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new Error("Email ou senha incorretos");
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    
    if (!isPasswordValid) {
      throw new Error("Email ou senha incorretos");
    }

    // Gerar JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || "sua-chave-secreta-aqui",
      { expiresIn: '7d' }
    );

    // Retornar usuário sem senha
    const { senha: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token
    };
  }
}