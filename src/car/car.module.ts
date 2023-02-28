import { Module, CacheModule } from '@nestjs/common';
import { ReservationModule } from 'src/reservation/reservation.module';
import { ReservationService } from 'src/reservation/reservation.service';
import { DatabaseModule } from 'src/utils/database/database.module';
import { DatabaseService } from 'src/utils/database/database.service';
import { CarController } from './car.controller';
import { CarService } from './car.service';
// import { HttpCacheInterceptor } from 'src/utils/CacheAdjustTracking.service';
// import { APP_INTERCEPTOR } from '@nestjs/core';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

@Module({
    imports: [
        DatabaseModule,
        ReservationModule,
        CacheModule.register<RedisClientOptions>({
            // ttl: 15000,
            store: redisStore,
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
        }),
    ],
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
