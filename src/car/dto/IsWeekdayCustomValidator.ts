/* eslint-disable @typescript-eslint/no-unused-vars */
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'IsWeekday', async: false })
export class IsWeekday implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        return value.getDay() !== 0 && value.getDay() !== 6;
    }

    defaultMessage(args: ValidationArguments) {
        return 'The car cannot be rented on weekends';
    }
}
