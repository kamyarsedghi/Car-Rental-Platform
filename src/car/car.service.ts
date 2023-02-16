import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/utils/database/database.service';

@Injectable()
export class CarService {
    constructor(private readonly databaseService: DatabaseService) {}

    totalRentalPrice(days: number): number {
        if (days <= 4) {
            return days * 1000;
        } else if (days <= 9) {
            return this.totalRentalPrice(4) + (days - 4) * (1000 * 0.95);
        } else if (days <= 17) {
            return this.totalRentalPrice(9) + (days - 9) * (1000 * 0.9);
        } else if (days <= 30) {
            return this.totalRentalPrice(17) + (days - 17) * (1000 * 0.85);
        }
    }

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

    async checkCarAvailability(data): Promise<object> {
        const { carId, startDate, endDate } = data;
        const startDateRestrict = new Date(startDate),
            endDateRestrict = new Date(endDate);

        if (startDate.getDay() === 0 || startDate.getDay() === 6 || endDate.getDay() === 0 || endDate.getDay() === 6) {
            throw new BadRequestException('The car cannot be rented on weekends');
        }

        if (Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) > 30) {
            throw new BadRequestException('The maximum rental period is 30 days');
        }

        startDateRestrict.setDate(startDate.getDate() - 3);
        endDateRestrict.setDate(endDate.getDate() + 3);

        const query = `SELECT * FROM reservations WHERE car_id = ${carId} AND (start_date < '${endDateRestrict.toISOString()}' AND end_date > '${startDateRestrict.toISOString()}')`;

        return await this.databaseService.executeQuery(query).then(result => {
            return { carId, availability: result.rows.length > 0 ? false : true };
        });
    }

    async createTableIfNotExists(): Promise<void> {
        const query = `CREATE TABLE IF NOT EXISTS "reservations" (
            "id" SERIAL PRIMARY KEY,
            "car_id" INTEGER NOT NULL,
            "basic_tariff" INTEGER NOT NULL,
            "start_date" DATE NOT NULL,
            "end_date" DATE NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );`;
        await this.databaseService.executeQuery(query);
    }
}
