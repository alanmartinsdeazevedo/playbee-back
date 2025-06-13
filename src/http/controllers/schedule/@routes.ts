import { FastifyInstance } from "fastify";
import { z } from "zod";
import { updateScheduleController } from "./update-reservation-controller";
import { deleteScheduleController } from "./delete-reservation-controller";
import { getScheduleController } from "./get-reservation-controller";
import { createScheduleController, schemaCreateSchedule } from "./create-reservation-controller";


// Schema de resposta
const schemaScheduleResponse = z.object({
  id: z.string(),
  dataHoraInicio: z.string().datetime(),
  dataHoraFim: z.string().datetime(),
  status: z.string(),
  userId: z.string(),
  courtId: z.string(),
});

export async function routesSchedule(app: FastifyInstance) {
  // CREATE
  app.post("/schedules", {
    schema: {
      description: "Cria uma nova reserva de quadra",
      tags: ["Reserva"],
      body: schemaCreateSchedule,
      response: {
        201: schemaScheduleResponse,
        400: z.object({ message: z.string() }),
      },
    },
  }, createScheduleController);

  // GET (via body)
  app.post("/schedules/get", {
    schema: {
      description: "Busca uma reserva por ID",
      tags: ["Reserva"],
      body: z.object({ id: z.string() }),
      response: {
        200: schemaScheduleResponse,
        400: z.object({ message: z.string() }),
      },
    },
  }, getScheduleController);

  // UPDATE
  app.put("/schedules/update", {
    schema: {
      description: "Atualiza dados de uma reserva",
      tags: ["Reserva"],
      body: schemaCreateSchedule,
      response: {
        200: schemaScheduleResponse,
        400: z.object({ message: z.string() }),
      },
    },
  }, updateScheduleController);

  // DELETE
  app.delete("/schedules", {
    schema: {
      description: "Remove uma reserva de quadra",
      tags: ["Reserva"],
      body: z.object({ id: z.string() }),
      response: {
        204: z.null(),
        400: z.object({ message: z.string() }),
      },
    },
  }, deleteScheduleController);
}
