import { Module } from '@nestjs/common';
import { CarService } from './car/car.service';
import { CarController } from './car/car.controller';
import { CarModule } from './car/car.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    CarModule,
  ],
  controllers: [CarController],
  providers: [CarService],
})
export class AppModule {}
