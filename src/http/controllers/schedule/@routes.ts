import { FastifyInstance } from "fastify";
import { z } from "zod";
import { updateScheduleController } from "./update-reservation-controller";
import { deleteScheduleController } from "./delete-reservation-controller";
import { getScheduleController } from "./get-reservation-controller";
import { createScheduleController, schemaCreateSchedule } from "./create-reservation-controller";

const schemaScheduleResponse = z.object({
  id: z.string(),
  dataHoraInicio: z.string().datetime(),
  dataHoraFim: z.string().datetime(),
  status: z.string(),
  userId: z.string(),
  courtId: z.string(),
});

export async function routesSchedule(app: FastifyInstance) {
  app.post("/schedule", {
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

  app.get("/schedule/:id", {
    schema: {
      description: "Busca uma reserva por ID",
      tags: ["Reserva"],
      params: z.object({ id: z.string().uuid() }),
      response: {
        200: schemaScheduleResponse,
        400: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      },
    },
  }, getScheduleController);

  app.put("/schedule/:id", {
    schema: {
      description: "Atualiza dados de uma reserva",
      tags: ["Reserva"],
      params: z.object({ id: z.string().uuid() }),
      body: z.object({
        dataHoraInicio: z.string().datetime().optional(),
        dataHoraFim: z.string().datetime().optional(),
        status: z.string().optional(),
        userId: z.string().uuid().optional(),
        courtId: z.string().uuid().optional(),
      }),
      response: {
        200: schemaScheduleResponse,
        400: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      },
    },
  }, updateScheduleController);

  app.delete("/schedule/:id", {
    schema: {
      description: "Remove uma reserva de quadra",
      tags: ["Reserva"],
      params: z.object({ id: z.string().uuid() }),
      response: {
        204: z.null(),
        400: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      },
    },
  }, deleteScheduleController);
}