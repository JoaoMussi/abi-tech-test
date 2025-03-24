import { FormControl } from '@angular/forms';

export interface EmployeeForm {
  name: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  documentCode: FormControl<string | null>;
  role: FormControl<string | null>;
  managerName: FormControl<string | null>;
  birthDate: FormControl<Date | null>;
  number: FormControl<number | null>;
}

export interface CreateEmployeeForm extends EmployeeForm {}

export interface EditEmployeeForm extends EmployeeForm {
  id: FormControl<number | null>;
}
