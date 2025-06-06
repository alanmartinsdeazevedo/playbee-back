import { makeCreateUserUseCase } from "@/domain/user/@factories/make-create-user-use-case";
import { HttpStatusCode } from "axios";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export const schemaCreateUser = z.object({
    nome: z.string(),
    email: z.string().email(),
    senha: z.string().min(6),
    telefone: z.string(),
    role: z.string()
});

export async function createUserController(req: FastifyRequest, res: FastifyReply) { 
    try {
        const { nome, email, senha, telefone, role } = schemaCreateUser.parse(req.body);

        console.log('Criando usuário:', { nome, email, telefone, role });

        const createUserUseCase = makeCreateUserUseCase();
        const result = await createUserUseCase.execute({ 
            email, 
            nome, 
            senha, 
            telefone, 
            role 
        });  

        console.log('Usuário criado:', result);

        const user = result.user || result;

        const userResponse = {
            id: user.id,
            nome: user.nome,
            email: user.email,
            telefone: user.telefone,
            role: user.role
        };

        return res.status(HttpStatusCode.Created).send(userResponse);
        
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        
        if (error instanceof z.ZodError) {
            return res.status(HttpStatusCode.BadRequest).send({
                message: "Dados inválidos",
                errors: error.errors
            });
        }

        if (error instanceof Error) {
            if (error.message.includes("já está em uso")) {
                return res.status(HttpStatusCode.Conflict).send({
                    message: error.message
                });
            }
        }

        return res.status(HttpStatusCode.InternalServerError).send({
            message: "Erro interno do servidor"
        });
    }
}