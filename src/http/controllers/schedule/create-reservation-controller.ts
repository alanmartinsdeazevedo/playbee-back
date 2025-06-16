// src/http/controllers/schedule/create-reservation-controller.ts

import { makeCreateScheduleUseCase } from "@/domain/reservation/@factories/make-create-schedule-use-case";
import { HttpStatusCode } from "axios";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export const schemaCreateSchedule = z.object({
  dataHoraInicio: z.string().datetime(),
  dataHoraFim: z.string().datetime(), 
  status: z.string(),
  userId: z.string().uuid(),
  courtId: z.string().uuid(),
});

export async function createScheduleController(req: FastifyRequest, res: FastifyReply) {
  try {
    console.log('🔍 Dados recebidos no controller:', req.body);
    
    const { dataHoraInicio, dataHoraFim, status, userId, courtId } = schemaCreateSchedule.parse(req.body);

    console.log('✅ Dados validados:', { dataHoraInicio, dataHoraFim, status, userId, courtId });

    const createScheduleUseCase = makeCreateScheduleUseCase();
    const result = await createScheduleUseCase.execute({
      dataHoraInicio: new Date(dataHoraInicio),
      dataHoraFim: new Date(dataHoraFim),
      status,
      userId,
      courtId
    });

    console.log('✅ Use Case result:', result);
    console.log('✅ Schedule object:', result.schedule);

    // Garantir que estamos retornando um objeto válido
    const responseData = {
      id: result.schedule.id,
      dataHoraInicio: result.schedule.dataHoraInicio.toISOString(),
      dataHoraFim: result.schedule.dataHoraFim.toISOString(),
      status: result.schedule.status,
      userId: result.schedule.user_id,
      courtId: result.schedule.court_id,
    };

    console.log('✅ Response data:', responseData);

    return res.status(HttpStatusCode.Created).send(responseData);
  } catch (error) {
    console.error('❌ Erro completo no controller:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack');
    
    if (error instanceof z.ZodError) {
      console.error('❌ Erro de validação Zod:', error.errors);
      return res.status(HttpStatusCode.BadRequest).send({
        message: "Dados inválidos",
        errors: error.errors
      });
    }
    
    if (error instanceof Error) {
      // Verificar se é erro de conflito de horário
      if (error.message.includes('Já existe uma reserva')) {
        return res.status(HttpStatusCode.Conflict).send({
          message: error.message
        });
      }
      
      console.error('❌ Erro conhecido:', error.message);
      return res.status(HttpStatusCode.BadRequest).send({ 
        message: error.message 
      });
    }
    
    console.error('❌ Erro desconhecido:', error);
    return res.status(HttpStatusCode.InternalServerError).send({
      message: "Erro interno do servidor",
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}