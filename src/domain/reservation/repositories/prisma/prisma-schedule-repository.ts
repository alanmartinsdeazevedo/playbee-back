import { prisma } from "@/lib/prisma";
import { ScheduleRepository } from "../schedule-repository";
import { ScheduleParamsFunctionRepository } from "../../types/params/schedule";
import { ScheduleReturnFunctionRepository } from "../../types/return/schedule";




export class PrismaScheduleRepository implements ScheduleRepository {
    async create(schedule: ScheduleParamsFunctionRepository["createSchedule"]): Promise<ScheduleReturnFunctionRepository["getSchedule"]> {
        const { userId, courtId, ...rest } = schedule;

        const createdSchedule = await prisma.schedule.create({
            data: {
                ...rest,
                user: { connect: { id: userId } },
                court: { connect: { id: courtId } }
            }
        });

        return createdSchedule;
    }

    async update(id: string, data: ScheduleParamsFunctionRepository["updateSchedule"]): Promise <ScheduleReturnFunctionRepository["getSchedule"]>{
        const updatedSchedule = await prisma.schedule.update({
            where: {id},
            data: {
                ...data
            }
        });
        return updatedSchedule;
    }

    async getScheduleById(id: string): Promise<ScheduleReturnFunctionRepository["getSchedule"] | null> {
        const schedule = await prisma.schedule.findUnique({
            where: {id},
        })
        return schedule
    }
    async delete(id: string): Promise<void> {
        await prisma.schedule.delete({
            where: {id}
        })
    } 



}