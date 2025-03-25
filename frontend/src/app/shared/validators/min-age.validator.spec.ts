import { FormControl } from '@angular/forms';
import { minAgeValidator } from './min-age.validator';

describe('minAgeValidator', () => {
  const validator = minAgeValidator(18);

  it('should return null if the field is empty (no error)', () => {
    const control = new FormControl(null);
    expect(validator(control)).toBeNull();
  });

  it('should return null if the age is exactly 18', () => {
    const today = new Date();
    const birthDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    const control = new FormControl(birthDate.toISOString().split('T')[0]);
    expect(validator(control)).toBeNull();
  });

  it('should return null if the age is greater than 18', () => {
    const today = new Date();
    const birthDate = new Date(
      today.getFullYear() - 20,
      today.getMonth(),
      today.getDate()
    );
    const control = new FormControl(birthDate.toISOString().split('T')[0]);
    expect(validator(control)).toBeNull();
  });

  it('should return a validation error if the age is less than 18', () => {
    const today = new Date();
    const birthDate = new Date(
      today.getFullYear() - 17,
      today.getMonth(),
      today.getDate()
    );
    const control = new FormControl(birthDate.toISOString().split('T')[0]);
    expect(validator(control)).toEqual({
      minAge: { requiredAge: 18, actualAge: 17 },
    });
  });

  it('should return a validation error if the birthday is later in the current year (not yet turned 18)', () => {
    const today = new Date();
    const birthDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate() + 10
    );
    const control = new FormControl(birthDate.toISOString().split('T')[0]);
    expect(validator(control)).toEqual({
      minAge: { requiredAge: 18, actualAge: 17 },
    });
  });

  it('should return null if the birthday has already passed this year', () => {
    const today = new Date();
    const birthDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate() - 1
    );
    const control = new FormControl(birthDate.toISOString().split('T')[0]);
    expect(validator(control)).toBeNull();
  });
});
