import { Schedule } from "@prisma/client";
import { ScheduleRepository } from "../repositories/schedule-repository";


interface UpdateScheduleUseCaseRequest{
    id: string;
    dataHoraInicio?:  string;
    dataHoraFim?:     string;
    status?:          string;
    user_id?:        string;
    court_id?:       string;
}

interface UpdateScheduleUseCaseResponse{
    schedule: Schedule;
}

export class UpdateScheduleUseCase{
    constructor(private scheduleRepository: ScheduleRepository){}

    async execute({
        id,
        ...data
    }: UpdateScheduleUseCaseRequest): Promise<UpdateScheduleUseCaseResponse>{
        const schedule = await this.scheduleRepository.update(id, data);
        return {schedule};
    }
}