import { FastifyInstance } from "fastify";
import z from "zod";
import { createCourtController, schemaCreateCourt } from "./create-court-controller";
import { updateCourtController } from "./update-court-controller";
import { getAllCourtsController } from "./getall-court-controller";
import { getCourtByIdController } from "./get-court-by-id-controller";
import { deleteCourtController } from "./delete-court-controller";

export const schemaCourtResponse = z.object({
    id: z.string(),
    nome: z.string(),
    tipo: z.string(),
    localizacao: z.string()
});

export async function routesCourt(app: FastifyInstance) {
    // CREATE
    app.post("/court", {
        schema: {
            description: "Cria uma nova quadra",
            tags: ["Quadra"],
            body: schemaCreateCourt,
            response: {
                201: z.object({ court: schemaCreateCourt }),
                400: z.object({ message: z.string() }),
            },
        },
    }, createCourtController);

    // GET ALL
    app.get("/court", {
        schema: {
            description: "Lista de todas as quadras",
            tags: ["Quadra"],
            response: {
                200: z.object({
                    courts: z.array(schemaCourtResponse),
                }),
                400: z.object({ message: z.string() }),
            },
        }
    }, getAllCourtsController);

    // GET BY ID - NOVA ROTA
    app.get("/court/:id", {
        schema: {
            description: "Busca uma quadra por ID",
            tags: ["Quadra"],
            params: z.object({ id: z.string().uuid() }),
            response: {
                200: z.object({ court: schemaCourtResponse }),
                404: z.object({ message: z.string() }),
                400: z.object({ message: z.string() }),
            },
        }
    }, getCourtByIdController);

    // UPDATE
    app.put("/court/:id", {
        schema: {
            description: "Atualiza uma quadra",
            tags: ["Quadra"],
            params: z.object({ id: z.string() }),
            body: z.object({
                nome: z.string().optional(),
                tipo: z.string().optional(),
                localizacao: z.string().optional()
            }),
            response: {
                200: z.object({ court: schemaCreateCourt }),
                400: z.object({ message: z.string() }),
            },
        },
    }, updateCourtController);

    // DELETE
    app.delete("/court/:id", {
        schema: {
            description: "Deleta uma quadra",
            tags: ["Quadra"],
            params: z.object({ id: z.string() }),
            response: {
                204: z.null(), // No Content
                400: z.object({ message: z.string() }),
            },
        },
    }, deleteCourtController);
}