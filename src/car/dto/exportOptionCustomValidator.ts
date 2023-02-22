/* eslint-disable @typescript-eslint/no-unused-vars */
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'IsValidExportOption', async: false })
export class IsValidExportOption implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        return ['json', 'csv'].includes(value);
    }

    defaultMessage(args: ValidationArguments) {
        return 'Options only can be json or csv';
    }
}
