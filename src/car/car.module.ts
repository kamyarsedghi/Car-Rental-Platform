import { Module } from '@nestjs/common';
import { ReservationModule } from 'src/reservation/reservation.module';
import { ReservationService } from 'src/reservation/reservation.service';
import { DatabaseModule } from 'src/utils/database/database.module';
import { DatabaseService } from 'src/utils/database/database.service';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { RedisModule } from 'src/utils/redis/redis.module';

@Module({
    imports: [DatabaseModule, ReservationModule, RedisModule],
    controllers: [CarController],
    providers: [CarService, DatabaseService, ReservationService],
    exports: [CarService],
})
export class CarModule {}
