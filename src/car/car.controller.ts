import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReservationService } from 'src/reservation/reservation.service';
import { CarService } from './car.service';
import { CarDto } from './dto/car.dto';

@Controller('reservation')
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

    @Get('price/:days')
    calculatePrice(@Param('days') days: number): number {
        return this.reservationService.totalRentalPrice(days);
    }

    @Post('check')
    @UsePipes(new ValidationPipe({ transform: true }))
    checkCarAvailability(@Body() data: CarDto): Promise<object> {
        return this.reservationService.checkCarAvailability(data);
    }

    @Post('create')
    @UsePipes(new ValidationPipe({ transform: true }))
    createReservation(@Body() data: CarDto): Promise<object> {
        return this.reservationService.checkCarAvailability(data);
    }
}
