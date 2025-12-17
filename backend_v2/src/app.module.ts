import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChurnModule } from './churn/churn.module';
import { ChurnPrediction } from './churn/churn.entity'; // Import da Entity

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'churn_v2.db',
      entities: [ChurnPrediction],
      synchronize: true, // Apenas para dev/hackathon
    }),
    ChurnModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
