import { CourtParamsFunctionRepository } from "../types/params/court";
import { CourtReturnFunctionRepository } from "../types/return/court";

export interface CourtRepository {
    create(user: CourtParamsFunctionRepository["createCourt"]): Promise<CourtReturnFunctionRepository["getCourt"]>
    update(id: string, data: CourtParamsFunctionRepository["updateCourt"]): Promise<CourtReturnFunctionRepository["getCourt"]>
    delete(id: string): Promise<void>; 
    getAllCourts(): Promise<CourtReturnFunctionRepository["getCourt"][]>
}