export interface Employee {
  id?: number;
  name: string;
  lastName: string;
  email: string;
  documentCode: string;
  managerName?: string;
  birthDate: Date;
}
