import { Type } from 'class-transformer';
import { IsNumber, IsDate, IsNotEmpty, IsBoolean, IsOptional, Validate } from 'class-validator';
import { IsWeekday } from './IsWeekdayCustomValidator';

export class CarDto {
    @IsNotEmpty()
    @IsNumber()
    carId: number;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    @Validate(IsWeekday)
    startDate: Date;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    @Validate(IsWeekday)
    endDate: Date;

    @IsOptional()
    @IsBoolean()
    makeReservation?: boolean;
}
