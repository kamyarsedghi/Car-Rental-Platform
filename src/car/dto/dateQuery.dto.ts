import { Type } from 'class-transformer';
import { IsDate, IsOptional, Validate } from 'class-validator';
import { IsValidExportOption } from './exportOptionCustomValidator';
import { ApiProperty } from '@nestjs/swagger';

export class DateQueryDto {
    @ApiProperty({
        description: 'The start date of the reservation',
        example: '2020-01-01',
        required: false,
        default: '1993-01-01',
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    dateFrom?: Date;

    @ApiProperty({
        description: 'The end date of the reservation',
        example: '2020-12-01',
        required: false,
        default: '2100-12-20',
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    dateTo?: Date;

    @ApiProperty({
        description: 'The export file type',
        example: 'csv',
        // enumName: 'Available export types',
        enum: ['csv', 'json'],
        required: false,
    })
    @IsOptional()
    @Validate(IsValidExportOption)
    exportType?: string;
}
