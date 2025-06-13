import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { HttpStatusCode } from "axios";
import { makeUpdateScheduleUseCase } from "@/domain/reservation/@factories/make-update-schedule-use-case";

const schemaUpdateSchedule = z.object({
  id: z.string().uuid(),
  dataHoraInicio: z.string().datetime().optional(),
  dataHoraFim: z.string().datetime().optional(),
  status: z.string().optional(),
  user_id: z.string().uuid().optional(),
  court_id: z.string().uuid().optional(),
});

export async function updateScheduleController(req: FastifyRequest, res: FastifyReply) {
  try {
    const data = schemaUpdateSchedule.parse(req.body);

    const updateScheduleUseCase = makeUpdateScheduleUseCase();
    const { schedule } = await updateScheduleUseCase.execute(data);

    return res.status(HttpStatusCode.Ok).send(schedule);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).send({ message: error.message });
    }
    throw error;
  }
}
