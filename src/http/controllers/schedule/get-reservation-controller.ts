// src/http/controllers/schedule/get-reservation-controller.ts

import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { HttpStatusCode } from "axios";
import { makeGetScheduleUseCase } from "@/domain/reservation/@factories/make-get-schedule-use-case";

const schemaGetSchedule = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});

export async function getScheduleController(req: FastifyRequest, res: FastifyReply) {
  try {
    console.log('🔍 Controller: Buscando reserva por ID...');
    console.log('🔍 Params recebidos:', req.params);
    
    const { id } = schemaGetSchedule.parse(req.params);
    console.log('✅ ID validado:', id);

    const getScheduleUseCase = makeGetScheduleUseCase();
    console.log('✅ Use Case criado');

    const { scheduling } = await getScheduleUseCase.execute(id);
    console.log('✅ Resultado do Use Case:', scheduling);

    if (!scheduling) {
      console.log('❌ Reserva não encontrada');
      return res.status(HttpStatusCode.NotFound).send({ 
        message: "Reserva não encontrada" 
      });
    }

    // Mapear os dados para o formato esperado pelo frontend
    const scheduleResponse = {
      id: scheduling.id,
      dataHoraInicio: scheduling.dataHoraInicio.toISOString(),
      dataHoraFim: scheduling.dataHoraFim.toISOString(),
      status: scheduling.status,
      userId: scheduling.user_id,
      courtId: scheduling.court_id,
    };

    console.log('✅ Resposta formatada:', scheduleResponse);
    return res.status(HttpStatusCode.Ok).send(scheduleResponse);
    
  } catch (error) {
    console.error('❌ Erro detalhado no controller:', error);
    
    // Verificar se é erro de validação
    if (error instanceof z.ZodError) {
      console.error('❌ Erro de validação Zod:', error.errors);
      return res.status(HttpStatusCode.BadRequest).send({
        message: "ID inválido",
        errors: error.errors
      });
    }
    
    // Verificar se é erro específico do Use Case
    if (error instanceof Error) {
      if (error.message.includes('não encontrada') || error.message.includes('not found')) {
        return res.status(HttpStatusCode.NotFound).send({
          message: "Reserva não encontrada",
          error: error.message
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