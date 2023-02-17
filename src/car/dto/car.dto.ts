import { Type } from 'class-transformer';
import { IsNumber, IsDate, IsNotEmpty } from 'class-validator';

export class CarDto {
    @IsNotEmpty()
    @IsNumber()
    carId: number;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    startDate: Date;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    endDate: Date;

    makeReservation: boolean;
}
