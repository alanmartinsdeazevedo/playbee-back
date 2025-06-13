import { Schedule } from "@prisma/client";
import { ScheduleRepository } from "../repositories/schedule-repository";


interface CreateScheduleUseCaseRequest{
    dataHoraInicio:  Date;
    dataHoraFim:     Date;
    status:          string;
    userId:          string;
    courtId:         string;
}

interface CreateScheduleUseCaseResponse{
    schedule: Schedule
}

export class CreateScheduleUseCase{
    constructor(private scheduleRepository: ScheduleRepository){}

        async execute(data: CreateScheduleUseCaseRequest): Promise<CreateScheduleUseCaseResponse>{
            const schedule = await this.scheduleRepository.create(data);
            return {schedule};
        }
    
}