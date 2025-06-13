import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { HttpStatusCode } from "axios";
import { makeUpdateScheduleUseCase } from "@/domain/reservation/@factories/make-update-schedule-use-case";

const schemaUpdateScheduleParams = z.object({
  id: z.string().uuid(),
});

const schemaUpdateScheduleBody = z.object({
  dataHoraInicio: z.string().datetime().optional(),
  dataHoraFim: z.string().datetime().optional(),
  status: z.string().optional(),
  userId: z.string().uuid().optional(), // CORRIGIDO: consistência na nomenclatura
  courtId: z.string().uuid().optional(), // CORRIGIDO: consistência na nomenclatura
});

export async function updateScheduleController(req: FastifyRequest, res: FastifyReply) {
  try {
    // CORRIGIDO: separando validação de params e body
    const { id } = schemaUpdateScheduleParams.parse(req.params);
    const data = schemaUpdateScheduleBody.parse(req.body);

    const updateScheduleUseCase = makeUpdateScheduleUseCase();
    const { schedule } = await updateScheduleUseCase.execute({ 
      id, 
      ...data 
    });

    if (!schedule) {
      return res.status(HttpStatusCode.NotFound).send({ 
        message: "Reserva não encontrada" 
      });
    }

    return res.status(HttpStatusCode.Ok).send(schedule);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).send({ message: error.message });
    }
    throw error;
  }
}