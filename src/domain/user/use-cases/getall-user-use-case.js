"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllUsersUseCase = void 0;
class GetAllUsersUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute() {
        const users = await this.userRepository.getAllUsers();
        return { users };
    }
}
exports.GetAllUsersUseCase = GetAllUsersUseCase;
