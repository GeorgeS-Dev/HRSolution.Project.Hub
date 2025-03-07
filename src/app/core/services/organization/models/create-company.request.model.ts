export interface CreateCompanyRequest {
  industry: string;
  name: string;
  description?: string;
  country?: string;
  city?: string;
  address?: string;
  email?: string;
  phoneNumber?: string;
}