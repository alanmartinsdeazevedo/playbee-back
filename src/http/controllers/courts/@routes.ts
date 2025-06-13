import { FastifyInstance } from "fastify";
import z from "zod";
import { createCourtController, schemaCreateCourt } from "./create-court-controller";
import { updateCourtController } from "./update-court-controller";
import { getAllCourtsController } from "./getall-court-controller";
import { deleteCourtController } from "./delete-court-controller";



export const schemaCourtResponse = z.object({
    id: z.string(),
    nome: z.string(),
    tipo: z.string(),
    localizacao: z.string()
})

export async function routesCourt(app: FastifyInstance) {
    app.post("/courts", {
        schema: {
            description: "Cria uma nova quadra",
            tags: ["Quadra"],
            body: schemaCreateCourt,
            response: {
                    201: z.object({ court: schemaCreateCourt }),
                    400: z.object({ message: z.string() }),
                  },
        },
    }, createCourtController)

    app.put("/courts/:id", {
        schema: {
            description: "Atualiza uma quadra",
            tags: ["Quadra"],
            params: z.object({id: z.string()}),
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
    }, updateCourtController)

    app.get("/courts", {
        schema: {
            description: "Lista de todas as quadras",
            tags: ["Quadra"],
            response: {
                200: z.object({
                    users: z.array(schemaCourtResponse),
                }),
                400: z.object({ message: z.string() }),
            },
        }
    },getAllCourtsController)


    app.delete("/court/:id", {
        schema:{
            description: "Deleta uma quadra",
            tags: ["Quadra"],
            params: z.object({ id: z.string() }),
            response: {
              204: z.null(), // No Content
              400: z.object({ message: z.string() }),
            },
        },
    },deleteCourtController)

}