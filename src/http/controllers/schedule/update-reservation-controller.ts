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
  userId: z.string().uuid().optional(),
  courtId: z.string().uuid().optional(),
});

export async function updateScheduleController(req: FastifyRequest, res: FastifyReply) {
  try {
    console.log('🔍 Controller: Iniciando atualização de reserva');
    console.log('🔍 Params:', req.params);
    console.log('🔍 Body:', req.body);

    const { id } = schemaUpdateScheduleParams.parse(req.params);
    const data = schemaUpdateScheduleBody.parse(req.body);
    const authenticatedUser = req.user;

    if (!authenticatedUser) {
      return res.status(HttpStatusCode.Unauthorized).send({
        message: "Usuário não autenticado"
      });
    }

    console.log('✅ Dados validados:', { id, data });

    // Mapear campos do frontend (camelCase) para campos do banco (snake_case)
    const mappedData: any = {};
    
    if (data.dataHoraInicio) {
      mappedData.dataHoraInicio = new Date(data.dataHoraInicio);
    }
    
    if (data.dataHoraFim) {
      mappedData.dataHoraFim = new Date(data.dataHoraFim);
    }
    
    if (data.status) {
      mappedData.status = data.status;
    }
    
    if (data.userId) {
      mappedData.user_id = data.userId; // ✅ Mapear userId -> user_id
    }
    
    if (data.courtId) {
      mappedData.court_id = data.courtId; // ✅ Mapear courtId -> court_id
    }

    console.log('✅ Dados mapeados para o banco:', mappedData);

    const updateScheduleUseCase = makeUpdateScheduleUseCase();
    const { schedule } = await updateScheduleUseCase.execute({ 
      id, 
      userId: authenticatedUser.role === 'admin' ? undefined : authenticatedUser.userId, // Admin pode editar qualquer reserva
      ...mappedData 
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
      userId: schedule.user_id, // ✅ Mapear user_id -> userId
      courtId: schedule.court_id, // ✅ Mapear court_id -> courtId
    };

    console.log('✅ Resposta formatada:', responseData);
    return res.status(HttpStatusCode.Ok).send(responseData);
    
  } catch (error) {
    console.error('❌ Erro no controller de atualização:', error);
    
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