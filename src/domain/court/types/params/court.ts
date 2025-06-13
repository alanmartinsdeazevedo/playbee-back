import { Prisma } from "@prisma/client" 

export interface CourtParamsFunctionRepository{
    createCourt: Prisma.CourtCreateInput,
    updateCourt: Prisma.CourtUncheckedUpdateInput,
    

}