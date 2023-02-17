import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CarDto } from 'src/car/dto/car.dto';
import { ReservationService } from './reservation.service';

@Controller('reservation')
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}

    @Post('create')
    @UsePipes(new ValidationPipe({ transform: true }))
    createReservation(@Body() data: CarDto): Promise<object> {
        return this.reservationService.checkCarAvailability(data);
    }

    @Get('price/:days')
    calculatePrice(@Param('days') days: number): number {
        return this.reservationService.totalRentalPrice(days);
    }

    @Post('check')
    @UsePipes(new ValidationPipe({ transform: true }))
    checkCarAvailability(@Body() data: CarDto): Promise<object> {
        return this.reservationService.checkCarAvailability(data);
    }
}
