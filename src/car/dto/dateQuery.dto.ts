import { Type } from 'class-transformer';
import { IsDate, IsOptional, Validate } from 'class-validator';
import { IsValidExportOption } from './exportOptionCustomValidator';

export class DateQueryDto {
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    dateFrom?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    dateTo?: Date;

    @IsOptional()
    @Validate(IsValidExportOption)
    exportType?: string;
}
