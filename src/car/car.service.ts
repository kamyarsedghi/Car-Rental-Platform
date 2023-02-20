import { Injectable, NotFoundException } from '@nestjs/common';
import { ReservationService } from 'src/reservation/reservation.service';
import { DatabaseService } from 'src/utils/database/database.service';

@Injectable()
export class CarService {
    constructor(private readonly databaseService: DatabaseService, private readonly reservationService: ReservationService) {}

    async getAllReservationData(): Promise<object> {
        return await this.databaseService.executeQuery('SELECT * FROM reservations').then(result => {
            return result.rows;
        });
    }

    async getReservationData(id: number): Promise<object> {
        return await this.databaseService.executeQuery(`SELECT * FROM reservations WHERE id = ${id}`).then(result => {
            return result.rows[0];
        });
    }

    async getCarUsage(carId: number | object): Promise<object> {
        const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const query = `SELECT * FROM reservations WHERE car_id = ${carId}`;

        const carData = typeof carId === 'object' ? carId : await this.databaseService.executeQuery(query);

        // if (carData.rows.length === 0) {
        //     throw new NotFoundException('The car has not been rented or does not exist');
        // }

        const carUsage = carData.rows.reduce((acc, row) => {
            const startDate = new Date(row.start_date);
            const endDate = new Date(row.end_date);
            const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
            const month = startDate.getMonth();
            if (acc[month]) {
                acc[month].days += days;
                acc[month].count++;
            } else {
                acc[month] = { days, count: 1 };
            }
            return acc;
        }, {});

        for (const month in carUsage) {
            carUsage[month].percentage = ((carUsage[month].days / 30) * 100).toFixed(2);
            carUsage[monthName[month]] = carUsage[month];
            delete carUsage[month];
        }

        return carUsage;
    }

    async getAllCarsUsage(): Promise<object> {
        const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        //! VERY IMPORTANT QUERY - fully check it out
        const query = `SELECT cars.car_id, reservations.id reservation_id,car_name, car_license_plate, total_price, start_date, end_date FROM cars LEFT JOIN reservations ON cars.car_id = reservations.car_id`;

        const carsData = await this.databaseService.executeQuery(query);

        const allCarsUsage = carsData.rows.reduce((acc, car) => {
            const startDate = new Date(car.start_date);
            const endDate = new Date(car.end_date);
            const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
            const month = startDate.getMonth();

            if (acc[car.car_id]) {
                if (acc[car.car_id].record[month]) {
                    acc[car.car_id].record[month].days += days;
                    acc[car.car_id].record[month].count++;
                } else {
                    acc[car.car_id].record[month] = { days, count: 1 };
                }
            } else {
                acc[car.car_id] = { record: { [month]: { days, count: 1 } } };
            }
            return acc;
        }, {});

        for (const car in allCarsUsage) {
            for (const month in allCarsUsage[car].record) {
                allCarsUsage[car].record[month].percentage = ((allCarsUsage[car].record[month].days / 30) * 100).toFixed(2);

                allCarsUsage[car].license_plate = carsData.rows.find(row => row.car_id === Number(car)).car_license_plate;
                allCarsUsage[car].name = carsData.rows.find(row => row.car_id === Number(car)).car_name;

                allCarsUsage[car].record[monthName[month]] = allCarsUsage[car].record[month];
                delete allCarsUsage[car].record[month];

                if (allCarsUsage[car].record[monthName[month]].days === 0) {
                    allCarsUsage[car]['record'] = {};
                    delete allCarsUsage[car].record[monthName[month]];
                }
            }
        }

        return allCarsUsage;
    }

    async createTableIfNotExists(): Promise<void> {
        const query = `CREATE TABLE IF NOT EXISTS "reservations" (
            "id" SERIAL PRIMARY KEY,
            "car_id" INTEGER NOT NULL,
            "total_price" INTEGER NOT NULL,
            "start_date" DATE NOT NULL,
            "end_date" DATE NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );`;
        await this.databaseService.executeQuery(query);
    }
}
