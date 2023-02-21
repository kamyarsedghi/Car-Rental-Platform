import { Injectable } from '@nestjs/common';
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

    async getCarUsage(carId: number): Promise<object> {
        const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const query = `SELECT * FROM reservations WHERE car_id = ${carId}`;

        const carData = await this.databaseService.executeQuery(query);

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
                acc[car.car_id] = { record: { [month]: { days, count: 1 } }, license_plate: car.car_license_plate, name: car.car_name };
            }
            return acc;
        }, {});

        const allCarsUsageUpdated = {};

        for (const car in allCarsUsage) {
            allCarsUsageUpdated[car] = {};
            allCarsUsageUpdated[car].record = {};
            for (const month in allCarsUsage[car].record) {
                allCarsUsage[car].record[month].percentage = ((allCarsUsage[car].record[month].days / 30) * 100).toFixed(2);

                allCarsUsageUpdated[car].record[monthName[month]] = allCarsUsage[car].record[month];
                allCarsUsageUpdated[car] = { ...allCarsUsageUpdated[car], license_plate: allCarsUsage[car].license_plate, name: allCarsUsage[car].name };

                if (allCarsUsageUpdated[car].record[monthName[month]].days === 0) {
                    allCarsUsageUpdated[car]['record'] = {};
                    delete allCarsUsageUpdated[car].record[monthName[month]];
                }
            }
        }

        return allCarsUsageUpdated;
    }
}
