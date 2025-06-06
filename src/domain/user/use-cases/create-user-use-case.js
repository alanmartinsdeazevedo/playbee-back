"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserUseCase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class CreateUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(data) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error("Este email já está em uso");
        }
        const hashedPassword = await bcryptjs_1.default.hash(data.senha, 10);
        const user = await this.userRepository.create({
            ...data,
            senha: hashedPassword
        });
        const { senha: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword };
    }
}
exports.CreateUserUseCase = CreateUserUseCase;
