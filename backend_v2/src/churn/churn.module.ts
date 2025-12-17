import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ChurnController } from './churn.controller';
import { ChurnService } from './churn.service';
import { ChurnPrediction } from './churn.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ChurnPrediction]),
        HttpModule
    ],
    controllers: [ChurnController],
    providers: [ChurnService],
})
export class ChurnModule { }
