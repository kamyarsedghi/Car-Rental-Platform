import { Controller, Get, Param, ParseIntPipe, Query, UsePipes, ValidationPipe } from '@nestjs/common';

import { ReservationService } from 'src/reservation/reservation.service';
import { CarService } from './car.service';
import { DateQueryDto } from './dto/dateQuery.dto';
import { ApiOkResponse, ApiParam, ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { RedisService } from 'src/utils/redis/redis.service';
import { Client, Ctx, MessagePattern, Payload, RmqContext, Transport } from '@nestjs/microservices';

// @ApiExtraModels(DateQueryDto) or pass it on swagger module
@Controller('car')
export class CarController {
    constructor(private readonly carService: CarService, private readonly reservationService: ReservationService, private readonly redisService: RedisService) {}

    @MessagePattern('hello')
    async hello(@Payload() data: string[], @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const orginalMessage = context.getMessage();
        console.log('Received message:', data);
        channel.ack(orginalMessage);
        return 'Hello from car service';
    }

    @ApiTags('Car')
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

    // @ApiTags('Car')
    // @ApiOkResponse({})
    // @ApiBadRequestResponse({})
    // @Get('faker-cars')
    // async addFakerCars(): Promise<void> {
    //     return await this.carService.addFakerCars();
    // }

    @ApiTags('Car')
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
    @ApiBadRequestResponse({
        description: 'The id of the reservation is not valid',
        content: {
            'application/json': {
                schema: {
                    example: {
                        statusCode: 400,
                        message: 'Validation failed (numeric string is expected)',
                        error: 'Bad Request',
                    },
                },
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

    @ApiTags('Car')
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
    @ApiBadRequestResponse({
        description: 'The dateFrom or the dateTo or the exportType is not valid; every error message is in the example below.',
        content: {
            'application/json': {
                schema: {
                    example: {
                        statusCode: 400,
                        message: ['dateFrom must be a Date instance', 'dateTo must be a Date instance', 'Options only can be json or csv'],
                        error: 'Bad Request',
                    },
                },
            },
        },
    })
    @Get('usage/all')
    @UsePipes(new ValidationPipe({ transform: true }))
    async getAllCarsUsage(@Query() dateQueryDto?: DateQueryDto): Promise<object> {
        return await this.carService.getAllCarsUsage(dateQueryDto);
    }

    @ApiTags('Car')
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
    @ApiBadRequestResponse({
        description: 'The id of the car is not valid',
        content: {
            'application/json': {
                schema: {
                    example: {
                        statusCode: 400,
                        message: 'Validation failed (numeric string is expected)',
                        error: 'Bad Request',
                    },
                },
            },
        },
    })
    @Get('usage/:id')
    async getCarUsage(@Param('id', ParseIntPipe) id: number): Promise<object> {
        return await this.carService.getCarUsage(id);
    }

    // @ApiTags('Car')
    // @ApiOkResponse({})
    // @ApiBadRequestResponse({})
    // @UseInterceptors(FileInterceptor('file', multerOptions))
    // @Post('import-cars')
    // async addCars(@UploadedFile() file: Express.Multer.File): Promise<void> {
    //     return await this.carService.addCars(file);
    // }
}
