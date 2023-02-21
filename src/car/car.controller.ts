import { Controller, Get, Param, ParseIntPipe, Query, UsePipes, ValidationPipe } from '@nestjs/common';

import { ReservationService } from 'src/reservation/reservation.service';
import { CarService } from './car.service';
import { DateQueryDto } from './dto/dateQuery.dto';

@Controller('car')
export class CarController {
    constructor(private readonly carService: CarService, private readonly reservationService: ReservationService) {}

    @Get()
    async getAllReservationData() {
        return await this.carService.getAllReservationData();
    }

    @Get(':id')
    async getReservationData(@Param('id', ParseIntPipe) id: number) {
        return await this.carService.getReservationData(id);
    }

    @Get('usage/all')
    @UsePipes(new ValidationPipe({ transform: true }))
    async getAllCarsUsage(@Query() dateQueryDto?: DateQueryDto): Promise<object> {
        return await this.carService.getAllCarsUsage(dateQueryDto);
    }

    @Get('usage/:id')
    async getCarUsage(@Param('id', ParseIntPipe) id: number): Promise<object> {
        return await this.carService.getCarUsage(id);
    }
}
