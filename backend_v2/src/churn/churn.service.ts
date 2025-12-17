import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ChurnPrediction } from './churn.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChurnService {
    private readonly logger = new Logger(ChurnService.name);
    // URL do Microserviço Python (Mock ou Real)
    private readonly PYTHON_API_URL = 'http://localhost:8000/predict';

    constructor(
        @InjectRepository(ChurnPrediction)
        private churnRepo: Repository<ChurnPrediction>,
        private readonly httpService: HttpService,
    ) { }

    async predict(data: any): Promise<any> {
        this.logger.log('Recebendo solicitação de previsão...');

        try {
            // 1. Chamar Python API
            const response: any = await firstValueFrom(
                this.httpService.post(this.PYTHON_API_URL, data)
            );
            const result = response.data;

            this.logger.log(`Resultado Python: ${JSON.stringify(result)}`);

            // 2. Salvar no Banco (Histórico)
            // A ordem aqui é importante: save retorna a entidade com ID preenchido
            const execution = this.churnRepo.create({
                ...data, // Espalha dados do input na entidade (campos compatíveis)
                cliente_id_origem: data.cliente_id || 'N/A',
                previsao: result.previsao,
                probabilidade: result.probabilidade,
                risco_alto: result.risco_alto
            } as ChurnPrediction);

            const saved = await this.churnRepo.save(execution);

            return {
                ...result,
                historico_id: saved.id,
                mensagem: "Previsão realizada e salva com sucesso."
            };

        } catch (error: any) {
            this.logger.error('Erro ao comunicar com serviço Python', error.message);
            // Fallback ou erro
            if (error.code === 'ECONNREFUSED') {
                return { error: "Serviço de IA (Python) indisponível. Verifique se api_v2_mock.py está rodando." };
            }
            // Devolver erro genérico para não travar o front
            return { error: `Erro interno: ${error.message}` };
        }
    }

    async getHistory() {
        return this.churnRepo.find({ order: { data_analise: 'DESC' }, take: 50 });
    }

    async getStats() {
        const total = await this.churnRepo.count();
        const churns = await this.churnRepo.count({ where: { previsao: 'Vai cancelar' } });
        return {
            total_analises: total,
            total_churn_previsto: churns,
            taxa_risco: total > 0 ? (churns / total).toFixed(2) : 0
        };
    }
}
