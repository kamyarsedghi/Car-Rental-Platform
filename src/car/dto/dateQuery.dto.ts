import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class DateQueryDto {
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    dateFrom?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    dateTo?: Date;
}
