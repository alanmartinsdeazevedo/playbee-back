import { makeLoginUserUseCase } from "@/domain/user/@factories/make-login-user-use-case";
import { HttpStatusCode } from "axios";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const schemaLogin = z.object({
    email: z.string().email("Email inválido"),
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres")
});

export async function loginController(req: FastifyRequest, res: FastifyReply) {
    try {
        const { email, senha } = schemaLogin.parse(req.body);

        const loginUserUseCase = makeLoginUserUseCase();
        const { user, token } = await loginUserUseCase.execute({ email, senha });

        return res.status(HttpStatusCode.Ok).send({
            message: "Login realizado com sucesso",
            user,
            token
        });

    } catch (error) {
        console.error("Erro no login:", error);
        
        if (error instanceof z.ZodError) {
            return res.status(HttpStatusCode.BadRequest).send({
                message: "Dados inválidos",
                errors: error.errors
            });
        }

        if (error instanceof Error) {
            if (error.message.includes("Email ou senha incorretos")) {
                return res.status(HttpStatusCode.Unauthorized).send({
                    message: error.message
                });
            }
        }

        return res.status(HttpStatusCode.InternalServerError).send({
            message: "Erro interno do servidor"
        });
    }
}