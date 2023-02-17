import { Controller, Get, Param } from '@nestjs/common';
import { ReservationService } from 'src/reservation/reservation.service';
import { CarService } from './car.service';

@Controller('car')
export class CarController {
    constructor(private readonly carService: CarService, private readonly reservationService: ReservationService) {}

    async onModuleInit() {
        await this.carService.createTableIfNotExists();
    }

    @Get()
    async getAllReservationData() {
        return await this.carService.getAllReservationData();
    }

    @Get(':id')
    async getReservationData(@Param('id') id: number) {
        return await this.carService.getReservationData(id);
    }

    @Get('usage/:id')
    async getCarUsage(@Param('id') id: number): Promise<object> {
        return await this.carService.getCarUsage(id);
    }
}
