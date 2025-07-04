// src/http/controllers/schedule/@routes.ts

import { FastifyInstance } from "fastify";
import { z } from "zod";
import { updateScheduleController } from "./update-reservation-controller";
import { deleteScheduleController } from "./delete-reservation-controller";
import { getScheduleController } from "./get-reservation-controller";
import { createScheduleController, schemaCreateSchedule } from "./create-reservation-controller";
import { getAllReservationsController } from "./get-all-reservations-controller";
import { cancelScheduleController } from "./cancel-reservation-controller";
import { authMiddleware } from "../../middlewares/auth";

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
    preHandler: [authMiddleware],
    schema: {
      description: "Cria uma nova reserva de quadra",
      tags: ["Reserva"],
      body: schemaCreateSchedule,
      response: {
        201: schemaScheduleResponse,
        400: z.object({ 
          message: z.string(),
          errors: z.array(z.any()).optional()
        }),
        401: z.object({ message: z.string() }),
        500: z.object({ message: z.string() }),
      },
    },
  }, createScheduleController);

  app.get("/schedule", {
    preHandler: [authMiddleware],
    schema: {
      description: "Lista todas as reservas",
      tags: ["Reserva"],
      querystring: z.object({
        userId: z.string().uuid().optional(),
      }).optional(),
      response: {
        200: z.object({
          schedules: z.array(schemaScheduleResponse),
        }),
        400: z.object({ message: z.string() }),
        401: z.object({ message: z.string() }),
        500: z.object({ message: z.string() }),
      },
    },
  }, getAllReservationsController);

  app.get("/schedule/:id", {
    schema: {
      description: "Busca uma reserva por ID",
      tags: ["Reserva"],
      params: z.object({ id: z.string().uuid() }),
      response: {
        200: schemaScheduleResponse,
        400: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
        500: z.object({ message: z.string() }),
      },
    },
  }, getScheduleController);

  app.put("/schedule/:id", {
    preHandler: [authMiddleware],
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
        401: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
        500: z.object({ message: z.string() }),
      },
    },
  }, updateScheduleController);

  app.delete("/schedule/:id", {
    preHandler: [authMiddleware],
    schema: {
      description: "Remove uma reserva de quadra",
      tags: ["Reserva"],
      params: z.object({ id: z.string().uuid() }),
      response: {
        204: z.null(),
        400: z.object({ message: z.string() }),
        401: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
        500: z.object({ message: z.string() }),
      },
    },
  }, deleteScheduleController);

  app.patch("/schedule/:id/cancel", {
    preHandler: [authMiddleware],
    schema: {
      description: "Cancela uma reserva",
      tags: ["Reserva"],
      params: z.object({ id: z.string().uuid() }),
      response: {
        200: z.object({
          message: z.string(),
          schedule: schemaScheduleResponse,
        }),
        400: z.object({ message: z.string() }),
        401: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
        500: z.object({ message: z.string() }),
      },
    },
  }, cancelScheduleController);
}