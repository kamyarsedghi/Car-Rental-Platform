import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { types, Pool } from 'pg';

@Injectable()
export class DatabaseService {
    constructor(private config: ConfigService) {
        //NOTE - This function overrides the default behavior of the pg types module which is responsible to parse the data from the database to the local time zone which in turn result is a time difference.
        types.setTypeParser(1082, value => new Date(value));
        types.setTypeParser(1114, value => {
            const date = new Date(value);
            date.setHours(date.getHours() + 4);
            return date;
        });
    }

    private pool = new Pool({
        host: this.config.get('DB_HOST'),
        port: this.config.get('DB_PORT'),
        max: this.config.get('DB_MAX_CONNECTIONS'),
        user: this.config.get('DB_USER'),
        password: this.config.get('DB_PASSWORD'),
        database: this.config.get('DB_NAME'),
    });

    async connect() {
        return await this.pool.connect();
    }

    async executeQuery(query: string): Promise<any> {
        try {
            const client = await this.pool.connect();
            const result = await client.query(query);
            client.release(true);
            return result;
        } catch (error) {
            console.log(error);
            process.exit(0);
            await this.pool.end();
            return error;
        }
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

        const query_cars = `CREATE TABLE IF NOT EXISTS "cars" (
            "id" SERIAL PRIMARY KEY,
            "car_id" INTEGER NOT NULL,
            "car_name" VARCHAR(255) NOT NULL,
            "car_license_plate" VARCHAR(255) NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );`;

        await this.executeQuery(query);
        await this.executeQuery(query_cars);
    }
}
