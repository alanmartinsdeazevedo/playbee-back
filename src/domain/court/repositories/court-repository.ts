import { CourtParamsFunctionRepository } from "../types/params/court";
import { CourtReturnFunctionRepository } from "../types/return/court";

export interface CourtRepository {
    create(court: CourtParamsFunctionRepository["createCourt"]): Promise<CourtReturnFunctionRepository["getCourt"]>
    update(id: string, data: CourtParamsFunctionRepository["updateCourt"]): Promise<CourtReturnFunctionRepository["getCourt"]>
    delete(id: string): Promise<void>
    getAllCourts(): Promise<CourtReturnFunctionRepository["getCourt"][]>
    getCourtById(id: string): Promise<CourtReturnFunctionRepository["getCourt"] | null>
}