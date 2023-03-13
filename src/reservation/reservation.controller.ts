import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe, HttpCode } from '@nestjs/common';
import { CarDto } from '../car/dto/car.dto';
import { ReservationService } from './reservation.service';
import { ApiBody, ApiOkResponse, ApiParam, ApiTags, ApiCreatedResponse, ApiBadRequestResponse, ApiProduces } from '@nestjs/swagger';

@Controller('reservation')
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}

    @ApiTags('Reservation')
    @ApiCreatedResponse({
        description: 'The reservation has been created.',
        schema: {
            example: {
                id: 1,
                car_id: 1,
                total_price: 8750,
                start_date: '2020-01-01T00:00:00.000Z',
                end_date: '2020-01-10T00:00:00.000Z',
                created_at: '2023-02-24T17:55:12.759Z',
                updated_at: '2023-02-24T17:55:12.759Z',
            },
        },
    })
    @ApiBadRequestResponse({
        description: 'Either the car is not available for the given dates, the car id is not valid, the start date is not valid or the end date is not valid.',
        schema: {
            example: {
                'Car is not available': {
                    value: {
                        statusCode: 400,
                        message: 'The car is not available for the selected period',
                        error: 'Bad Request',
                    },
                },
                'The car id is not valid !!!! ADD FUNCTIONALITY !!!!': {
                    value: {
                        statusCode: 400,
                        message: 'The car id is not valid',
                        error: 'Bad Request',
                    },
                },
                'The start date is not valid': {
                    value: {
                        statusCode: 400,
                        message: 'startDate must be a Date instance',
                        error: 'Bad Request',
                    },
                },
                'The end date is not valid': {
                    value: {
                        statusCode: 400,
                        message: 'endDate must be a Date instance',
                        error: 'Bad Request',
                    },
                },
            },
        },
    })
    @ApiBody({
        type: CarDto,
        examples: {
            'Make reservation': {
                value: {
                    carId: 1,
                    startDate: '2020-01-01',
                    endDate: '2020-01-10',
                    makeReservation: true,
                },
            },
            'Check availability': {
                value: {
                    carId: 1,
                    startDate: '2020-01-01',
                    endDate: '2020-01-10',
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

    @ApiTags('Reservation')
    @ApiOkResponse({
        description: 'The total price of a car rental for a given number of days',
        schema: {
            example: 1000,
        },
    })
    @ApiBadRequestResponse({
        description: 'The days parameter is not a number',
        schema: {
            example: 'NaN',
        },
    })
    @ApiProduces('text/html; charset=utf-8')
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

    @ApiTags('Reservation')
    @ApiOkResponse({
        description: 'The reservation data for the given id.',
        schema: {
            example: {
                id: 1,
                car_id: 1,
                total_price: 8750,
                start_date: '2020-01-01T00:00:00.000Z',
                end_date: '2020-01-10T00:00:00.000Z',
                created_at: '2023-02-24T17:55:12.759Z',
                updated_at: '2023-02-24T17:55:12.759Z',
            },
        },
    })
    @ApiBadRequestResponse({
        description:
            'Either the car is not available for the given dates, the car id is not valid, the start date is not valid or the end date is not valid, or either of those are undefined.',
        schema: {
            example: {
                'Car is not available': {
                    value: {
                        statusCode: 400,
                        message: 'The car is not available for the selected period',
                        error: 'Bad Request',
                    },
                },
                'The car id is not valid !!!! ADD FUNCTIONALITY !!!!': {
                    value: {
                        statusCode: 400,
                        message: 'The car id is not valid',
                        error: 'Bad Request',
                    },
                },
                'The start date is not valid': {
                    value: {
                        statusCode: 400,
                        message: 'startDate must be a Date instance',
                        error: 'Bad Request',
                    },
                },
                'The end date is not valid': {
                    value: {
                        statusCode: 400,
                        message: 'endDate must be a Date instance',
                        error: 'Bad Request',
                    },
                },
                'The start date is undefined': {
                    value: {
                        statusCode: 400,
                        message: 'startDate should not be null or undefined',
                        error: 'Bad Request',
                    },
                },
                'The end date is undefined': {
                    value: {
                        statusCode: 400,
                        message: 'endDate should not be null or undefined',
                        error: 'Bad Request',
                    },
                },
            },
        },
    })
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
    @HttpCode(200)
    @Post('check')
    @UsePipes(new ValidationPipe({ transform: true, stopAtFirstError: true }))
    checkCarAvailability(@Body() data: CarDto): Promise<object> {
        return this.reservationService.checkCarAvailability(data);
    }
}
