import { Court } from "@prisma/client";

export interface CourtReturnFunctionRepository{
    getCourt: Court
}