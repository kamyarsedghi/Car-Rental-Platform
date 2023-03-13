import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../utils/database/database.service';

@Injectable()
export class ReservationService {
    constructor(private readonly databaseService: DatabaseService) {}

    totalRentalPrice(days: number): number {
        days === 0 ? (days = 1) : days;
        if (days <= 4) {
            return days * 1000;
        }
        if (days <= 9) {
            return this.totalRentalPrice(4) + (days - 4) * (1000 * 0.95);
        }
        if (days <= 17) {
            return this.totalRentalPrice(9) + (days - 9) * (1000 * 0.9);
        }
        return this.totalRentalPrice(17) + (days - 17) * (1000 * 0.85);
    }

    async checkCarAvailability(data): Promise<object> {
        const { carId, startDate, endDate } = data;
        const startDateRestrict = new Date(startDate),
            endDateRestrict = new Date(endDate);

        if (Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) > 30) {
            throw new BadRequestException('The maximum rental period is 30 days');
        }

        startDateRestrict.setDate(startDate.getDate() - 3);
        endDateRestrict.setDate(endDate.getDate() + 3);

        const query = `SELECT * FROM reservations WHERE car_id = ${carId} AND (start_date < '${endDateRestrict.toISOString()}' AND end_date > '${startDateRestrict.toISOString()}')`;

        return await this.databaseService.executeQuery(query).then(result => {
            if (result.rows.length > 0) {
                throw new BadRequestException('The car is not available for the selected period');
            }

            return data.makeReservation ? this.createReservation(data) : { carId, availability: true };
        });
    }

    async createReservation(data): Promise<object> {
        const { carId, startDate, endDate } = data;

        const query = `INSERT INTO reservations (car_id, total_price, start_date, end_date) VALUES (${carId}, ${this.totalRentalPrice(
            Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)),
        )}, '${startDate.toISOString()}', '${endDate.toISOString()}') RETURNING *`;

        return await this.databaseService.executeQuery(query).then(result => {
            return result.rows[0];
        });
    }
}
