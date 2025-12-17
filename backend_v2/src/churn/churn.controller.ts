import { Controller, Post, Body, Get } from '@nestjs/common';
import { ChurnService } from './churn.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Churn')
@Controller('churn')
export class ChurnController {
    constructor(private readonly churnService: ChurnService) { }

    @Post('predict')
    @ApiOperation({ summary: 'Prever Churn para um único cliente' })
    @ApiResponse({ status: 201, description: 'Previsão realizada com sucesso.' })
    async predict(@Body() colunas: any) {
        return this.churnService.predict(colunas);
    }

    @Get('history')
    @ApiOperation({ summary: 'Listar últimas análises' })
    async history() {
        return this.churnService.getHistory();
    }

    @Get('stats')
    @ApiOperation({ summary: 'Estatísticas gerais' })
    async stats() {
        return this.churnService.getStats();
    }
}
