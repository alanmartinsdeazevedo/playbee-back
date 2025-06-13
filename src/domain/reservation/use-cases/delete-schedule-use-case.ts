import { ScheduleRepository } from "../repositories/schedule-repository";

interface DeleteScheduleUseCaseRequest{
    id: string;
}

export class DeleteScheduleUseCase{
    constructor(private scheduleRepository: ScheduleRepository){}

    async execute(id: string): Promise<void>{
        await this.scheduleRepository.delete(id);
    }
}