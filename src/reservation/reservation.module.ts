import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/utils/database/database.service';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';

@Module({
    providers: [ReservationService, DatabaseService],
    exports: [ReservationService],
    controllers: [ReservationController],
})
export class ReservationModule {}
