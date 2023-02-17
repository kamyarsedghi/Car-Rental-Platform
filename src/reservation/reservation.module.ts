import { Module } from '@nestjs/common';
import { CarService } from 'src/car/car.service';
import { DatabaseService } from 'src/utils/database/database.service';
import { ReservationService } from './reservation.service';

@Module({
    providers: [ReservationService, DatabaseService],
    exports: [ReservationService],
})
export class ReservationModule {}
