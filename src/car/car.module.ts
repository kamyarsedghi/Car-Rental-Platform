import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/utils/database/database.module';
import { DatabaseService } from 'src/utils/database/database.service';
import { CarController } from './car.controller';
import { CarService } from './car.service';

@Module({
    imports: [DatabaseModule],
    controllers: [CarController],
    providers: [CarService, DatabaseService],
})
export class CarModule {}
