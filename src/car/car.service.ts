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
