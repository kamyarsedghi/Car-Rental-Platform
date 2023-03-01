import { BadRequestException, Injectable } from '@nestjs/common';
import { ReservationService } from 'src/reservation/reservation.service';
import { DatabaseService } from 'src/utils/database/database.service';
import { DateQueryDto } from './dto/dateQuery.dto';
import * as fs from 'fs-extra';
import * as path from 'path';
import { RedisService } from 'src/utils/redis/redis.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ObjectsToCsv = require('objects-to-csv');

@Injectable()
export class CarService {
    constructor(private readonly databaseService: DatabaseService, private readonly reservationService: ReservationService, private readonly redisService: RedisService) {}

    async getAllReservationData(): Promise<object> {
        const result = await this.redisService.getOrSet(
            '/car',
            async () => {
                const result = await this.databaseService.executeQuery('SELECT * FROM reservations');
                return result.rows;
            },
            10,
        );
        return result;
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

    async getAllCarsUsage(dateQueryDto?: DateQueryDto): Promise<object> {
        const { dateFrom = new Date('1993-01-01'), dateTo = new Date('2100-12-20'), exportType } = dateQueryDto;

        if (dateFrom && dateTo && dateFrom > dateTo) {
            throw new BadRequestException('dateFrom cannot be greater than dateTo');
        }

        const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        // const query = `SELECT cars.car_id, reservations.id reservation_id,car_name, car_license_plate, total_price, start_date, end_date FROM cars LEFT JOIN reservations ON cars.car_id = reservations.car_id`;
        // eslint-disable-next-line prettier/prettier
        const query2 = `SELECT cars.car_id, reservations.id reservation_id,car_name, car_license_plate, total_price, start_date, end_date FROM cars LEFT JOIN reservations ON cars.car_id = reservations.car_id WHERE start_date BETWEEN '${dateFrom?.toISOString().split('T')[0]}' AND '${dateTo?.toISOString().split('T')[0]}'`;

        const carsData = await this.databaseService.executeQuery(query2);

        const allCarsUsage = carsData.rows.reduce((acc, car) => {
            const startDate = new Date(car.start_date);
            const endDate = new Date(car.end_date);
            const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) || 1;
            const month = startDate.getMonth();
            const year = startDate.getFullYear();

            if (acc[`${monthName[month]},${year}`]) {
                if (acc[`${monthName[month]},${year}`][car.car_id]) {
                    acc[`${monthName[month]},${year}`][car.car_id].days += days;
                    acc[`${monthName[month]},${year}`][car.car_id].count++;
                    acc[`${monthName[month]},${year}`][car.car_id].percentage = ((acc[`${monthName[month]},${year}`][car.car_id].days / 30) * 100).toFixed(2);
                } else {
                    acc[`${monthName[month]},${year}`][car.car_id] = {
                        reservation_id: car.reservation_id,
                        name: car.car_name,
                        license_plate: car.car_license_plate,
                        days,
                        count: 1,
                    };
                    acc[`${monthName[month]},${year}`][car.car_id].percentage = ((acc[`${monthName[month]},${year}`][car.car_id].days / 30) * 100).toFixed(2);
                }
            } else {
                acc[`${monthName[month]},${year}`] = {
                    [car.car_id]: {
                        reservation_id: car.reservation_id,
                        name: car.car_name,
                        license_plate: car.car_license_plate,
                        days,
                        count: 1,
                    },
                };
                acc[`${monthName[month]},${year}`][car.car_id].percentage = ((acc[`${monthName[month]},${year}`][car.car_id].days / 30) * 100).toFixed(2);
            }

            return acc;
        }, {});

        const sortedAllCarsUsage = Object.entries(allCarsUsage)
            .sort((a, b) => {
                const [monthA, yearA] = a[0].split(',');
                const [monthB, yearB] = b[0].split(',');
                // eslint-disable-next-line prettier/prettier
                return yearA < yearB ? -1 : yearA > yearB ? 1 : monthName.indexOf(monthA) < monthName.indexOf(monthB) ? -1 : monthName.indexOf(monthA) > monthName.indexOf(monthB) ? 1 : 0;
            })
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});

        const toFile = Object.entries(sortedAllCarsUsage).map(([key, value]) => {
            return {
                month: key,
                cars: Object.entries(value).map(([key, value]) => {
                    return {
                        car_id: key,
                        ...value,
                    };
                }),
            };
        });

        if (exportType === 'json') {
            const filePathJson = path.join(__dirname, '..', '../reports', `${dateFrom.toISOString().split('T')[0]}-${dateTo.toISOString().split('T')[0]}-carsUsage.json`);
            const json = JSON.stringify(toFile);
            fs.writeFileSync(filePathJson, json);
        } else if (exportType === 'csv') {
            const filePathCSV = path.join(__dirname, '..', '../reports', `${dateFrom.toISOString().split('T')[0]}-${dateTo.toISOString().split('T')[0]}-carsUsage.csv`);
            const csv = new ObjectsToCsv(toFile);
            await csv.toDisk(filePathCSV);
        }

        return sortedAllCarsUsage;
    }
}
