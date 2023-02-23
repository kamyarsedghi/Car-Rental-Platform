import { Type } from 'class-transformer';
import { IsNumber, IsDate, IsNotEmpty, IsBoolean, IsOptional, Validate } from 'class-validator';
import { IsWeekday } from './IsWeekdayCustomValidator';
import { ApiProperty } from '@nestjs/swagger';

export class CarDto {
    @ApiProperty({
        description: 'The id of the car',
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    carId: number;

    @ApiProperty({
        description: 'The start date of the reservation',
        example: '2020-01-01',
    })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    @Validate(IsWeekday)
    startDate: Date;

    @ApiProperty({
        description: 'The end date of the reservation',
        example: '2020-12-01',
    })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    @Validate(IsWeekday)
    endDate: Date;

    @ApiProperty({
        description: 'Whether or not to make a reservation; this can be either false or left out when checking availability',
        example: true,
        type: Boolean,
        required: false,
    })
    // @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    makeReservation?: boolean;
}
