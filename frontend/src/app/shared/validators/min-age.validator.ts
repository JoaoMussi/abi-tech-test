import {
    AbstractControl,
    ValidationErrors,
    ValidatorFn
} from '@angular/forms';

export function minAgeValidator(minAge: number = 18): ValidatorFn {
  return (dateControl: AbstractControl): ValidationErrors | null => {
    if (!dateControl.value) {
      return null;
    }

    const birthDate = new Date(dateControl.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    const isBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());

    const actualAge = isBirthdayPassed ? age : age - 1;

    return actualAge < minAge
      ? ({ minAge: { requiredAge: minAge, actualAge } } as ValidationErrors)
      : null;
  };
}
