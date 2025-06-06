"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserUseCase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class LoginUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute({ email, senha }) {
        // Buscar usuário por email
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("Email ou senha incorretos");
        }
        // Verificar senha
        const isPasswordValid = await bcryptjs_1.default.compare(senha, user.senha);
        if (!isPasswordValid) {
            throw new Error("Email ou senha incorretos");
        }
        // Gerar JWT token
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET || "sua-chave-secreta-aqui", { expiresIn: '7d' });
        // Retornar usuário sem senha
        const { senha: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            token
        };
    }
}
exports.LoginUserUseCase = LoginUserUseCase;
