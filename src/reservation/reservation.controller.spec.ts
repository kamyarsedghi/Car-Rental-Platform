// import { Test, TestingModule } from '@nestjs/testing';
// import { ReservationController } from './reservation.controller';
// import { ReservationService } from './reservation.service';
// import { it } from 'node:test';
// import { DatabaseService } from 'src/utils/database/database.service';

// describe('ReservationController', () => {
//     let reservationController: ReservationController;
//     let reservationService: ReservationService;

//     beforeEach(async () => {
//         reservationService = new ReservationService(DatabaseService);
//         reservationController = new ReservationController(reservationService);
//     });

//     it('should return 1000', () => {
//         expect(reservationController.calculatePrice(1)).toBe(1000);
//     }

import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { DatabaseService } from '../utils/database/database.service';
import { CarDto } from 'src/car/dto/car.dto';

describe('ReservationController', () => {
    let controller: ReservationController;
    let service: ReservationService;
    let databaseService: DatabaseService;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [ReservationController],
            providers: [
                ReservationService,
                {
                    provide: DatabaseService,
                    useValue: {
                        // Mock database service methods as needed for the tests
                    },
                },
            ],
        }).compile();

        controller = moduleRef.get<ReservationController>(ReservationController);
        service = moduleRef.get<ReservationService>(ReservationService);
        databaseService = moduleRef.get<DatabaseService>(DatabaseService);
    });

    describe('calculatePrice', () => {
        const daysPrices = [
            [4, 4000],
            [5, 4950],
            [10, 9650],
            [29, 26150],
        ];

        it.each(daysPrices)(`Rental price for %i is %i $`, async (days, prices) => {
            const result = controller.calculatePrice(days);
            expect(result).toEqual(prices);
        });

        // expect(service.totalRentalPrice).toHaveBeenCalledWith(days);
        // jest.spyOn(service, 'totalRentalPrice').mockReturnValue(price);
        // const result = await controller.calculatePrice(days);
        // expect(result).toEqual(price);
        // });

        // it('should throw BadRequestException if days parameter is not a number', async () => {
        //     const days = 'invalid';

        //     await expect(controller.calculatePrice(days)).rejects.toThrowError('Validation failed');
        // });
    });

    describe('Checking car availability in a period', () => {
        const data = [
            { carId: 1, startDate: new Date('2020-02-25'), endDate: new Date('2020-02-31'), expected: { carId: 1, availability: true } },
            {
                carId: 1,
                startDate: new Date('2023-07-10'),
                endDate: new Date('2023-07-17'),
                expected: { statusCode: 400, message: 'The car is not available for the selected period', error: 'Bad Request' },
            },
        ];

        // expect(service.checkCarAvailability).toHaveBeenCalledWith({ carId: 1, startDate: new Date('2020-02-25'), endDate: new Date('2020-02-31') });
        // jest.spyOn(service, 'checkCarAvailability').mockReturnValue(Promise.resolve({ carId: 1, availability: true }));
        // const result = { carId: 1, availability: true };
        // jest.spyOn(service, 'checkCarAvailability').mockImplementation(() => Promise.resolve(result));

        it('should return car availability', async () => {
            const result = { carId: 1, availability: true };
            jest.spyOn(service, 'checkCarAvailability').mockImplementation(() => Promise.resolve(result));
            expect(await controller.checkCarAvailability({ carId: 1, startDate: new Date('2020-02-25'), endDate: new Date('2020-02-31') })).toEqual({
                carId: 1,
                availability: true,
            });
        });

        // it.each(data)(`Car %i is available for the period %s - %s`, async ({ carId, startDate, endDate, expected }) => {
        //     const result = await controller.checkCarAvailability({ carId, startDate, endDate });
        //     expect(result).toEqual(expected);
        // });
    });
});
