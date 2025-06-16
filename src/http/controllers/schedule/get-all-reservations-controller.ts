import { makeGetAllSchedulesUseCase } from "@/domain/reservation/@factories/make-get-all-schedules-use-case";
import { HttpStatusCode } from "axios";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const schemaQuery = z.object({
  userId: z.string().uuid().optional(),
}).optional();

export async function getAllReservationsController(req: FastifyRequest, res: FastifyReply) {
  try {
    console.log('🔍 Buscando todas as reservas...');
    
    const query = schemaQuery.parse(req.query);
    const userId = query?.userId;

    const getAllSchedulesUseCase = makeGetAllSchedulesUseCase();
    const result = await getAllSchedulesUseCase.execute({ userId });

    console.log('✅ Reservas encontradas:', result.schedules.length);

    const mappedSchedules = result.schedules.map(schedule => ({
      id: schedule.id,
      dataHoraInicio: schedule.dataHoraInicio.toISOString(),
      dataHoraFim: schedule.dataHoraFim.toISOString(),
      status: schedule.status,
      userId: schedule.user_id,
      courtId: schedule.court_id,
    }));

    return res.status(HttpStatusCode.Ok).send({
      schedules: mappedSchedules
    });
  } catch (error) {
    console.error('❌ Erro ao buscar reservas:', error);
    
    if (error instanceof Error) {
      return res.status(HttpStatusCode.BadRequest).send({ 
        message: error.message 
      });
    }
    
    return res.status(HttpStatusCode.InternalServerError).send({
      message: "Erro interno do servidor"
    });
  }
}