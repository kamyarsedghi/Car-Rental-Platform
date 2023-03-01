import { Module, CacheModule } from '@nestjs/common';
import { CarService } from './car/car.service';
import { CarController } from './car/car.controller';
import { CarModule } from './car/car.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './utils/database/database.module';
import { ReservationService } from './reservation/reservation.service';
import { ReservationModule } from './reservation/reservation.module';
import * as redisStore from 'cache-manager-redis-store';

@Module({
    imports: [
        CacheModule.register({
            isGlobal: true,
            ttl: 5,
            store: redisStore,
            host: 'redis',
            port: 6379,
        }),
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
