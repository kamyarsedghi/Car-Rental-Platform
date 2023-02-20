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

    async getCarUsage(carId: number): Promise<object> {
        const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const query = `SELECT * FROM reservations WHERE car_id = ${carId}`;

        const carData = await this.databaseService.executeQuery(query);

        if (carData.rows.length === 0) {
            throw new NotFoundException('The car has not been rented or does not exist');
        }

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
}
