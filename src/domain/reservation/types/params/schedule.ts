export interface ScheduleParamsFunctionRepository {
    createSchedule: {
        dataHoraInicio: Date;
        dataHoraFim: Date;
        status: string;
        userId: string;
        courtId: string;
    };
    updateSchedule: {
        dataHoraInicio?: Date;
        dataHoraFim?: Date;
        status?: string;
        user_id?: string;
        court_id?: string;
    };
    findById: string;
}