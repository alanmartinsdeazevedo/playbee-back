import { Schedule } from "@prisma/client";
import { ScheduleRepository } from "../repositories/schedule-repository";

interface GetSheduleUseCaseRequest{
    id: string;
}

interface GetSheduleUseCaseResponse {
    scheduling: Schedule | null;
}

export class GetScheduleUseCase{
    constructor (private scheduleRepository: ScheduleRepository){}

    async execute(id: string): Promise<GetSheduleUseCaseResponse> {
        const scheduling = await this.scheduleRepository.getScheduleById(id);
        return {scheduling};
    }
}