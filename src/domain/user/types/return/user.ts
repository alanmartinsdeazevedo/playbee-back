import { User } from "@prisma/client";

export interface UserReturnFunctionRepository{
    getUser: User
}