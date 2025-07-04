import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { HttpStatusCode } from "axios";

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
}

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthenticatedUser;
  }
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return reply.status(HttpStatusCode.Unauthorized).send({
        message: "Token de acesso não fornecido",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return reply.status(HttpStatusCode.Unauthorized).send({
        message: "Token de acesso inválido",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "sua-chave-secreta-aqui"
    ) as AuthenticatedUser;

    request.user = decoded;
  } catch (error) {
    return reply.status(HttpStatusCode.Unauthorized).send({
      message: "Token de acesso inválido",
    });
  }
}

export function requireRole(requiredRole: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.status(HttpStatusCode.Unauthorized).send({
        message: "Usuário não autenticado",
      });
    }

    if (request.user.role !== requiredRole) {
      return reply.status(HttpStatusCode.Forbidden).send({
        message: "Acesso negado. Permissão insuficiente",
      });
    }
  };
}