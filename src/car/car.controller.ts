import { Controller, Get, Param, ParseIntPipe, Query, UsePipes, ValidationPipe } from '@nestjs/common';

import { ReservationService } from 'src/reservation/reservation.service';
import { CarService } from './car.service';
import { DateQueryDto } from './dto/dateQuery.dto';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';

// @ApiExtraModels(DateQueryDto) or pass it on swagger module
@Controller('car')
export class CarController {
    constructor(private readonly carService: CarService, private readonly reservationService: ReservationService) {}

    @ApiOkResponse({
        description: 'All cars reservation records',
        schema: {
            example: [
                {
                    id: 1,
                    car_id: 1,
                    total_price: 1000,
                    start_date: '2020-01-01',
                    end_date: '2020-01-01',
                    created_at: '2020-01-01T11:26:31.735Z',
                    updated_at: '2020-01-01T11:26:31.735Z',
                },
                {
                    id: 2,
                    car_id: 2,
                    total_price: 2000,
                    start_date: '2020-01-01',
                    end_date: '2020-01-02',
                    created_at: '2020-01-01T11:26:31.735Z',
                    updated_at: '2020-01-01T11:26:31.735Z',
                },
            ],
        },
    })
    @Get()
    async getAllReservationData() {
        return await this.carService.getAllReservationData();
    }

    @ApiOkResponse({
        description: 'Getting a single reservation record providing the id of that reservation',
        schema: {
            example: {
                id: 1,
                car_id: 1,
                total_price: 1000,
                start_date: '2020-01-01',
                end_date: '2020-01-02',
                created_at: '2020-01-01T11:26:31.735Z',
                updated_at: '2020-01-01T11:26:31.735Z',
            },
        },
    })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'The id of the reservation',
        type: Number,
    })
    @Get(':id')
    async getReservationData(@Param('id', ParseIntPipe) id: number) {
        return await this.carService.getReservationData(id);
    }

    @ApiOkResponse({
        description: 'All reservations records between the specified dates sorted by the month and the year',
        // type: DateQueryDto,
        schema: {
            example: {
                'January,2020': {
                    1: {
                        reservation_id: 8,
                        name: 'BMW',
                        license_plate: 'CC333CC',
                        days: 18,
                        count: 4,
                        percentage: '60.00',
                    },
                },
                'February,2020': {
                    1: {
                        reservation_id: 9,
                        name: 'BMW',
                        license_plate: 'CC333CC',
                        days: 5,
                        count: 1,
                        percentage: '16.67',
                    },
                    2: {
                        reservation_id: 10,
                        name: 'Audi',
                        license_plate: 'BB222BB',
                        days: 7,
                        count: 1,
                        percentage: '23.33',
                    },
                },
            },
        },
    })
    // @ApiQuery({
    //     name: 'startDate',
    //     required: true,
    //     description: 'The start date of the reservation',
    //     type: String,
    // })
    // @ApiQuery({
    //     name: 'endDate',
    //     required: true,
    //     description: 'The end date of the reservation',
    //     type: String,
    // })
    @Get('usage/all')
    @UsePipes(new ValidationPipe({ transform: true }))
    async getAllCarsUsage(@Query() dateQueryDto?: DateQueryDto): Promise<object> {
        return await this.carService.getAllCarsUsage(dateQueryDto);
    }

    @ApiOkResponse({
        description: 'All the reservation record of a specific car.',
        schema: {
            example: {
                January: {
                    days: 18,
                    count: 5,
                    percentage: '60.00',
                },
                February: {
                    days: 5,
                    count: 1,
                    percentage: '16.67',
                },
                May: {
                    days: 10,
                    count: 2,
                    percentage: '33.33',
                },
            },
        },
    })
    @Get('usage/:id')
    async getCarUsage(@Param('id', ParseIntPipe) id: number): Promise<object> {
        return await this.carService.getCarUsage(id);
    }
}
