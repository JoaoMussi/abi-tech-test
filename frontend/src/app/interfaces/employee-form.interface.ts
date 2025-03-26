import { FormControl } from '@angular/forms';

export interface EmployeeForm {
  id?: FormControl<number | null>;
  name: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  documentCode: FormControl<string | null>;
  role: FormControl<string | null>;
  managerName: FormControl<string | null>;
  birthDate: FormControl<Date | null>;
  hiringDate: FormControl<Date | null>;
  salary: FormControl<number | null>;
  phone: FormControl<string | null>;
  password?: FormControl<string | null>;
}
