import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { HttpStatusCode } from "axios";
import { makeUpdateScheduleUseCase } from "@/domain/reservation/@factories/make-update-schedule-use-case";

const schemaCancelScheduleParams = z.object({
  id: z.string().uuid(),
});

export async function cancelScheduleController(req: FastifyRequest, res: FastifyReply) {
  try {
    console.log('🔍 Controller: Iniciando cancelamento de reserva');
    console.log('🔍 Params:', req.params);

    const { id } = schemaCancelScheduleParams.parse(req.params);
    const authenticatedUser = req.user;

    if (!authenticatedUser) {
      return res.status(HttpStatusCode.Unauthorized).send({
        message: "Usuário não autenticado"
      });
    }

    console.log('✅ Dados validados:', { id });

    const updateScheduleUseCase = makeUpdateScheduleUseCase();
    const { schedule } = await updateScheduleUseCase.execute({ 
      id, 
      userId: authenticatedUser.role === 'admin' ? undefined : authenticatedUser.userId, // Admin pode cancelar qualquer reserva
      status: 'cancelado'
    });

    if (!schedule) {
      return res.status(HttpStatusCode.NotFound).send({ 
        message: "Reserva não encontrada" 
      });
    }

    // Mapear resposta do banco (snake_case) para o frontend (camelCase)
    const responseData = {
      id: schedule.id,
      dataHoraInicio: schedule.dataHoraInicio.toISOString(),
      dataHoraFim: schedule.dataHoraFim.toISOString(),
      status: schedule.status,
      userId: schedule.user_id,
      courtId: schedule.court_id,
    };

    console.log('✅ Reserva cancelada com sucesso:', responseData);
    return res.status(HttpStatusCode.Ok).send({
      message: "Reserva cancelada com sucesso",
      schedule: responseData
    });
    
  } catch (error) {
    console.error('❌ Erro no controller de cancelamento:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(HttpStatusCode.BadRequest).send({
        message: "Dados inválidos",
        errors: error.errors
      });
    }
    
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