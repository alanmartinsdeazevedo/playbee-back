import { UserParamsFunctionRepository } from "../types/params/user";
import { UserReturnFunctionRepository } from "../types/return/user";

export interface UserRepository {
    create(user: UserParamsFunctionRepository["createUser"]): Promise<UserReturnFunctionRepository["getUser"]>
    update(id: string, data: UserParamsFunctionRepository["updateUser"]): Promise<UserReturnFunctionRepository["getUser"]>
    getAllUsers(): Promise<UserReturnFunctionRepository["getUser"][]>
    delete(id: string): Promise<void>
    findByEmail(email: string): Promise<UserReturnFunctionRepository["getUser"] | null>
    findById(id: string): Promise<UserReturnFunctionRepository["getUser"] | null>
}