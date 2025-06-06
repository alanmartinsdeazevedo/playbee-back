import { Prisma } from "@prisma/client"

export interface UserParamsFunctionRepository{
    createUser: Prisma.UserCreateInput,
    updateUser: Prisma.UserUncheckedUpdateInput,
    findByEmail: string
}