"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserUseCase = void 0;
class UpdateUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute({ id, ...data }) {
        const user = await this.userRepository.update(id, data);
        return { user };
    }
}
exports.UpdateUserUseCase = UpdateUserUseCase;
