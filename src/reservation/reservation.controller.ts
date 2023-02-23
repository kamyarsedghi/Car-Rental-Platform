import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CarDto } from 'src/car/dto/car.dto';
import { ReservationService } from './reservation.service';
import { ApiBody, ApiOkResponse, ApiParam } from '@nestjs/swagger';

@Controller('reservation')
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}

    @ApiBody({
        type: CarDto,
        examples: {
            'Make reservation': {
                value: {
                    carId: 1,
                    startDate: '2020-01-01',
                    endDate: '2020-01-01',
                    makeReservation: true,
                },
            },
            'Check availability': {
                value: {
                    carId: 1,
                    startDate: '2020-01-01',
                    endDate: '2020-01-01',
                },
                description: 'You may use **/reservation/check** endpoint to check a reservation without passing the makeReservation property',
            },
        },
    })
    @Post('create')
    @UsePipes(new ValidationPipe({ transform: true }))
    createReservation(@Body() data: CarDto): Promise<object> {
        return this.reservationService.checkCarAvailability(data);
    }

    @ApiOkResponse({
        description: 'The total price of a car rental for a given number of days',
        schema: {
            example: 1000,
        },
    })
    @ApiParam({
        description: 'The number of days to calculate the price',
        name: 'days',
        required: true,
        type: Number,
    })
    @Get('price/:days')
    calculatePrice(@Param('days') days: number): number {
        return this.reservationService.totalRentalPrice(days);
    }

    @ApiBody({
        type: CarDto,
        description: 'The makeReservation property is optional and can be left out when checking availability',
        // schema: {
        //     example: {
        //         carId: 1,
        //         startDate: '2020-01-01',
        //         endDate: '2020-01-01',
        //     },
        // },
        examples: {
            'Check availability': {
                value: {
                    carId: 1,
                    startDate: '2020-01-01',
                    endDate: '2020-01-01',
                },
            },
            'Make reservation': {
                value: {
                    carId: 1,
                    startDate: '2020-01-01',
                    endDate: '2020-01-01',
                    makeReservation: true,
                },
                description: 'You may use **/reservation/create** to create a reservation with the makeReservation property',
            },
        },
    })
    @Post('check')
    @UsePipes(new ValidationPipe({ transform: true }))
    checkCarAvailability(@Body() data: CarDto): Promise<object> {
        return this.reservationService.checkCarAvailability(data);
    }
}
