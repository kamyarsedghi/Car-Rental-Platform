import { Module } from '@nestjs/common';
import { CarService } from './car/car.service';
import { CarController } from './car/car.controller';
import { CarModule } from './car/car.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './utils/database/database.module';
import { ReservationService } from './reservation/reservation.service';
import { ReservationModule } from './reservation/reservation.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        CarModule,
        DatabaseModule,
        ReservationModule,
    ],
    controllers: [CarController],
    providers: [CarService, ReservationService],
})
export class AppModule {}
