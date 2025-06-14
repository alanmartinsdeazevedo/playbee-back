import { FastifyInstance } from "fastify";
import { z } from "zod";
import { createUserController, schemaCreateUser } from "./create-user-controller";
import { updateUserController } from "./update-user-controller";
import { getAllUsersController } from "./getall-user-controller";
import { getUserByIdController } from "./get-user-by-id-controller";
import { deleteUserController } from "./delete-user-controller";
import { loginController } from "../auth/login-controller";

export const schemaUserResponse = z.object({
  id: z.string(),
  nome: z.string(),
  email: z.string().email(),
  telefone: z.string().optional(),
  role: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const schemaLogin = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres")
});

export const schemaLoginResponse = z.object({
  message: z.string(),
  user: schemaUserResponse,
  token: z.string(),
});

export async function routesUser(app: FastifyInstance) {
  // LOGIN
  app.post("/auth/login", {
    schema: {
      description: "Realiza login do usuário",
      tags: ["Autenticação"],
      body: schemaLogin,
      response: {
        200: schemaLoginResponse,
        400: z.object({ 
          message: z.string(),
          errors: z.array(z.any()).optional() 
        }),
        401: z.object({ message: z.string() }),
        500: z.object({ message: z.string() }),
      },
    },
  }, loginController);

  // LOGOUT
  app.post("/auth/logout", {
    schema: {
      description: "Realiza logout do usuário",
      tags: ["Autenticação"],
      response: {
        200: z.object({ message: z.string() }),
        500: z.object({ message: z.string() }),
      },
    },
  }, async (req, res) => {
    return res.status(200).send({
      message: "Logout realizado com sucesso"
    });
  });

  // CREATE USER
  app.post("/users", {
    schema: {
      description: "Cria um novo usuário",
      tags: ["Usuário"],
      body: schemaCreateUser,
      response: {
        201: schemaUserResponse,
        400: z.object({ 
          message: z.string(),
          errors: z.array(z.any()).optional() 
        }),
        409: z.object({ message: z.string() }),
        500: z.object({ message: z.string() }),
      },
    },
  }, createUserController);

  // GET ALL USERS
  app.get("/users", {
    schema: {
      description: "Lista todos os usuários",
      tags: ["Usuário"],
      response: {
        200: z.object({
          users: z.array(schemaUserResponse),
        }),
        400: z.object({ message: z.string() }),
        500: z.object({ message: z.string() }),
      },
    },
  }, getAllUsersController);

  // GET USER BY ID - NOVA ROTA
  app.get("/users/:id", {
    schema: {
      description: "Busca um usuário por ID",
      tags: ["Usuário"],
      params: z.object({ id: z.string().uuid() }),
      response: {
        200: z.object({ user: schemaUserResponse }),
        404: z.object({ message: z.string() }),
        400: z.object({ message: z.string() }),
        500: z.object({ message: z.string() }),
      },
    }
  }, getUserByIdController);

  // UPDATE USER
  app.put("/users/:id", {
    schema: {
      description: "Atualiza um usuário",
      tags: ["Usuário"],
      params: z.object({ id: z.string().uuid() }),
      body: z.object({
        nome: z.string().optional(),
        email: z.string().email().optional(),
        senha: z.string().min(6).optional(),
        telefone: z.string().optional(),
        role: z.string().optional()
      }),
      response: {
        200: z.object({ user: schemaUserResponse }),
        400: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
        409: z.object({ message: z.string() }),
        500: z.object({ message: z.string() }),
      },
    },
  }, updateUserController);

  // DELETE USER
  app.delete("/users/:id", {
    schema: {
      description: "Deleta um usuário",
      tags: ["Usuário"],
      params: z.object({ id: z.string().uuid() }),
      response: {
        204: z.null(), // No Content
        400: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
        500: z.object({ message: z.string() }),
      },
    },
  }, deleteUserController);
}