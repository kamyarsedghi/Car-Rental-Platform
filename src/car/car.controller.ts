import { Body, Controller, Get, Param, ParseIntPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReservationService } from 'src/reservation/reservation.service';
import { CarService } from './car.service';
import { CarDto } from './dto/car.dto';

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
    async getReservationData(@Param('id', ParseIntPipe) id: number) {
        return await this.carService.getReservationData(id);
    }

    @Get('price/:days')
    calculatePrice(@Param('days', ParseIntPipe) days: number): number {
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

    @Get('usage/all')
    async getAllCarsUsage(): Promise<object> {
        return await this.carService.getAllCarsUsage();
    }

    @Get('usage/:id')
    async getCarUsage(@Param('id', ParseIntPipe) id: number): Promise<object> {
        return await this.carService.getCarUsage(id);
    }
}
