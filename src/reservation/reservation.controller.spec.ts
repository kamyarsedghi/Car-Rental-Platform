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

describe('ReservationController', () => {
    let controller: ReservationController;
    let service: ReservationService;
    let databaseService: DatabaseService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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

        controller = module.get<ReservationController>(ReservationController);
        service = module.get<ReservationService>(ReservationService);
        databaseService = module.get<DatabaseService>(DatabaseService);
    });

    describe('calculatePrice', () => {
        // it('should return the total rental price', async () => {
        const daysPrices = [
            [4, 4000],
            [5, 4950],
            [10, 9650],
            [29, 26150],
        ];

        // jest.spyOn(service, 'totalRentalPrice').mockReturnValue(price);

        // const result = await controller.calculatePrice(days);

        // expect(result).toEqual(price);

        it.each(daysPrices)(`Rental price for %i is %i $`, async (days, prices) => {
            const result = controller.calculatePrice(days);
            expect(result).toEqual(prices);
        });

        // expect(service.totalRentalPrice).toHaveBeenCalledWith(days);
        // });

        // it('should throw BadRequestException if days parameter is not a number', async () => {
        //     const days = 'invalid';

        //     await expect(controller.calculatePrice(days)).rejects.toThrowError('Validation failed');
        // });
    });
});
