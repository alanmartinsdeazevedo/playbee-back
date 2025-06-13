import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { HttpStatusCode } from "axios";
import { makeGetScheduleUseCase } from "@/domain/reservation/@factories/make-get-schedule-use-case";

const schemaGetSchedule = z.object({
  id: z.string().uuid(),
});

export async function getScheduleController(req: FastifyRequest, res: FastifyReply) {
  try {
    const { id } = schemaGetSchedule.parse(req.body);

    const getScheduleUseCase = makeGetScheduleUseCase();
    const { scheduling } = await getScheduleUseCase.execute(id);

    return res.status(HttpStatusCode.Ok).send(scheduling);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).send({ message: error.message });
    }
    throw error;
  }
}
