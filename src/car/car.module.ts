import { Module } from '@nestjs/common';
import { ReservationModule } from 'src/reservation/reservation.module';
import { ReservationService } from 'src/reservation/reservation.service';
import { DatabaseModule } from 'src/utils/database/database.module';
import { DatabaseService } from 'src/utils/database/database.service';
import { CarController } from './car.controller';
import { CarService } from './car.service';
// import { HttpCacheInterceptor } from 'src/utils/CacheAdjustTracking.service';
// import { APP_INTERCEPTOR } from '@nestjs/core';
// import type { RedisClientOptions } from 'redis';

@Module({
    imports: [DatabaseModule, ReservationModule],
    controllers: [CarController],
    providers: [
        CarService,
        DatabaseService,
        ReservationService,
        //This also can be done to reduce the code in the controller - all endpoints will be cached
        // {
        //     provide: APP_INTERCEPTOR,
        //     useClass: CacheInterceptor,
        // },
    ],
    exports: [CarService],
})
export class CarModule {}
