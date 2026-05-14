export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  departmentId: string;
  token?: string;
  expiryAt?: string;
}
