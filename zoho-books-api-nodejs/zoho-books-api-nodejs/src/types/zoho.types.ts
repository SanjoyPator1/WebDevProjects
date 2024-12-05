export interface ZohoConfig {
  clientId: string;
  clientSecret: string;
  region: string;
  redirectUri: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  api_domain: string;
  token_type: string;
}

export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
}

export interface Organization {
  organization_id: string;
  name: string;
  contact_name: string;
  email: string;
  is_default_org: boolean;
  language_code: string;
  fiscal_year_start_month: number;
  account_created_date: string;
  time_zone: string;
  is_org_active: boolean;
  currency_id: string;
  currency_code: string;
  currency_symbol: string;
  currency_format: string;
  price_precision: number;
}

export interface OrganizationsResponse {
  code: number;
  message: string;
  organizations: Organization[];
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface ContactSearchParams extends PaginationParams {
  contact_name?: string;
  company_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  filter_by?: string;
  search_text?: string;
  sort_column?: string;
}
