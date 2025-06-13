import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { HttpStatusCode } from "axios";
import { makeDeleteScheduleUseCase } from "@/domain/reservation/@factories/make-delete-schedule-use-case";

const schemaDeleteSchedule = z.object({
  id: z.string().uuid(),
});

export async function deleteScheduleController(req: FastifyRequest, res: FastifyReply) {
  try {
    const { id } = schemaDeleteSchedule.parse(req.params);

    const deleteScheduleUseCase = makeDeleteScheduleUseCase();
    const result = await deleteScheduleUseCase.execute(id);

    if (result === null) {
      return res.status(HttpStatusCode.NotFound).send({ 
        message: "Reserva não encontrada" 
      });
    }

    return res.status(HttpStatusCode.NoContent).send();
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).send({ message: error.message });
    }
    throw error;
  }
}