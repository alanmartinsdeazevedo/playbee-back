import { prisma } from "@/lib/prisma";
import { CourtParamsFunctionRepository } from "../../types/params/court";
import { CourtReturnFunctionRepository } from "../../types/return/court";
import { CourtRepository } from "../court-repository";

export class PrismaCourtRepository implements CourtRepository {
    async delete(id: string): Promise<void> {
        try {
            console.log('🔍 Repository: Deletando quadra com ID:', id);
            
            // Verificar se a quadra existe primeiro
            const existingCourt = await prisma.court.findUnique({
                where: { id },
                include: { reservas: true }
            });
            
            if (!existingCourt) {
                throw new Error('Quadra não encontrada');
            }
            
            console.log('✅ Quadra encontrada:', existingCourt.nome);
            
            // Verificar se tem reservas associadas
            if (existingCourt.reservas && existingCourt.reservas.length > 0) {
                throw new Error(`Não é possível excluir a quadra "${existingCourt.nome}" pois ela possui ${existingCourt.reservas.length} reserva(s) associada(s)`);
            }
            
            // Deletar a quadra
            await prisma.court.delete({
                where: { id }
            });
            
            console.log('✅ Repository: Quadra deletada com sucesso');
        } catch (error) {
            console.error('❌ Erro no Repository delete:', error);
            throw error;
        }
    }
    
    async getAllCourts(): Promise<CourtReturnFunctionRepository["getCourt"][]> {
        try {
            console.log('🔍 Repository: Buscando todas as quadras...');
            
            const courts = await prisma.court.findMany({
                include: { reservas: true }
            });
            
            console.log('✅ Repository: Quadras encontradas:', courts.length);
            return courts;
        } catch (error) {
            console.error('❌ Erro no Repository getAllCourts:', error);
            throw error;
        }
    }

    async getCourtById(id: string): Promise<CourtReturnFunctionRepository["getCourt"] | null> {
        try {
            console.log('🔍 Repository: Buscando quadra por ID:', id);
            
            const court = await prisma.court.findUnique({
                where: { id },
                include: { reservas: true }
            });
            
            if (court) {
                console.log('✅ Repository: Quadra encontrada:', court.nome);
            } else {
                console.log('❌ Repository: Quadra não encontrada');
            }
            
            return court;
        } catch (error) {
            console.error('❌ Erro no Repository getCourtById:', error);
            throw error;
        }
    }
    
    async create(court: CourtParamsFunctionRepository["createCourt"]): Promise<CourtReturnFunctionRepository["getCourt"]> {
        try {
            console.log('🔍 Repository: Criando quadra:', court);
            
            const createdCourt = await prisma.court.create({
                data: {
                    ...court
                }
            });
            
            console.log('✅ Repository: Quadra criada:', createdCourt);
            return createdCourt;
        } catch (error) {
            console.error('❌ Erro no Repository create:', error);
            throw error;
        }
    }
    
    async update(id: string, data: CourtParamsFunctionRepository["updateCourt"]): Promise<CourtReturnFunctionRepository["getCourt"]> {
        try {
            console.log('🔍 Repository: Atualizando quadra:', { id, data });
            
            const updatedCourt = await prisma.court.update({
                where: { id },
                data: {
                    ...data
                }
            });
            
            console.log('✅ Repository: Quadra atualizada:', updatedCourt);
            return updatedCourt;
        } catch (error) {
            console.error('❌ Erro no Repository update:', error);
            throw error;
        }
    }
}