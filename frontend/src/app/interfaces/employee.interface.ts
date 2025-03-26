export interface Employee {
  id?: number;
  name: string;
  lastName: string;
  email: string;
  documentCode: string;
  role: string;
  managerName?: string;
  birthDate: Date;
  hiringDate?: Date;
  salary?: number;
  phone: string;
  password?: string;
}
