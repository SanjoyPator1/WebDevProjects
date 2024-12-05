import axios, { AxiosInstance, AxiosResponse } from "axios";

interface ZohoConfig {
  clientId: string;
  clientSecret: string;
  region: string;
  redirectUri: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  api_domain: string;
  token_type: string;
}

interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
}

interface Organization {
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

interface OrganizationsResponse {
  code: number;
  message: string;
  organizations: Organization[];
}

class ZohoAuthManager {
  private config: ZohoConfig;
  private tokenInfo: TokenInfo | null = null;
  private authBaseUrl: string;
  private apiBaseUrl: string;
  private axiosInstance: AxiosInstance;

  constructor(
    config: ZohoConfig,
    private grantToken?: string,
    private initialRefreshToken?: string
  ) {
    this.validateConfig(config);
    this.config = config;
    this.authBaseUrl = `https://accounts.zoho.${config.region}`;
    this.apiBaseUrl = `https://www.zohoapis.${config.region}/books/v3`;

    this.axiosInstance = axios.create({
      baseURL: this.apiBaseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private validateConfig(config: ZohoConfig): void {
    if (!config.redirectUri) {
      throw new Error("Redirect URI is required in config");
    }

    // Remove any trailing slashes from redirect URI
    config.redirectUri = config.redirectUri.replace(/\/+$/, "");

    // Validate URI format
    try {
      new URL(config.redirectUri);
    } catch (e) {
      throw new Error("Invalid redirect URI format");
    }
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await this.refreshAccessToken();
          const originalRequest = error.config;
          originalRequest.headers.Authorization = `Zoho-oauthtoken ${this.tokenInfo?.accessToken}`;
          return axios(originalRequest);
        }
        return Promise.reject(error);
      }
    );
  }

  public generateAuthUrl(
    scopes: string[] = ["ZohoBooks.fullaccess.all"]
  ): string {
    const params = new URLSearchParams({
      scope: scopes.join(","),
      client_id: this.config.clientId,
      response_type: "code",
      access_type: "offline",
      redirect_uri: this.config.redirectUri,
      prompt: "consent", // Always show consent screen
    });

    return `${this.authBaseUrl}/oauth/v2/auth?${params.toString()}`;
  }

  public async initialize(): Promise<void> {
    if (this.initialRefreshToken) {
      this.tokenInfo = {
        accessToken: "",
        refreshToken: this.initialRefreshToken,
        expiresAt: new Date(),
      };
      await this.refreshAccessToken();
    } else if (this.grantToken) {
      await this.getTokensFromGrant();
    } else {
      throw new Error("Either grant token or refresh token must be provided");
    }
  }

  private async getTokensFromGrant(): Promise<void> {
    try {
      const response = await axios.post<TokenResponse>(
        `${this.authBaseUrl}/oauth/v2/token`,
        null,
        {
          params: {
            code: this.grantToken,
            client_id: this.config.clientId,
            client_secret: this.config.clientSecret,
            redirect_uri: this.config.redirectUri,
            grant_type: "authorization_code",
          },
        }
      );

      this.tokenInfo = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresAt: new Date(Date.now() + response.data.expires_in * 1000),
      };
    } catch (error: any) {
      throw new Error(`Failed to get tokens from grant: ${error.message}`);
    }
  }

  private async refreshAccessToken(): Promise<void> {
    if (!this.tokenInfo?.refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await axios.post<TokenResponse>(
        `${this.authBaseUrl}/oauth/v2/token`,
        null,
        {
          params: {
            refresh_token: this.tokenInfo.refreshToken,
            client_id: this.config.clientId,
            client_secret: this.config.clientSecret,
            redirect_uri: this.config.redirectUri,
            grant_type: "refresh_token",
          },
        }
      );

      this.tokenInfo = {
        ...this.tokenInfo,
        accessToken: response.data.access_token,
        expiresAt: new Date(Date.now() + response.data.expires_in * 1000),
      };
    } catch (error: any) {
      throw new Error(`Failed to refresh token: ${error.message}`);
    }
  }

  public async getValidAccessToken(): Promise<string> {
    if (!this.tokenInfo) {
      throw new Error("Not initialized");
    }

    if (new Date() >= this.tokenInfo.expiresAt) {
      await this.refreshAccessToken();
    }

    return this.tokenInfo.accessToken;
  }

  public getRefreshToken(): string | undefined {
    return this.tokenInfo?.refreshToken;
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

class ZohoAPI {
  private organizationId: string | null = null;
  private authManager: ZohoAuthManager;

  constructor(authManager: ZohoAuthManager) {
    this.authManager = authManager;
  }

  private async updateAuthHeader(): Promise<void> {
    const accessToken = await this.authManager.getValidAccessToken();
    this.authManager.getAxiosInstance().defaults.headers.common[
      "Authorization"
    ] = `Zoho-oauthtoken ${accessToken}`;
  }

  public async getOrganizations(): Promise<OrganizationsResponse> {
    await this.updateAuthHeader();
    const response = await this.authManager
      .getAxiosInstance()
      .get<OrganizationsResponse>("/organizations");

    if (response.data?.organizations?.[0]) {
      this.organizationId = response.data.organizations[0].organization_id;
    }

    return response.data;
  }

  private async ensureOrganizationId(): Promise<void> {
    if (!this.organizationId) {
      const response = await this.getOrganizations();
      if (!response?.organizations?.[0]?.organization_id) {
        throw new Error("No organization found");
      }
      this.organizationId = response.organizations[0].organization_id;
    }
  }

  public async getContacts(
    page: number = 1,
    perPage: number = 200
  ): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .get("/contacts", {
        params: {
          organization_id: this.organizationId,
          page,
          per_page: perPage,
        },
      });

    return response.data;
  }

  public async getInvoices(
    page: number = 1,
    perPage: number = 200
  ): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .get("/invoices", {
        params: {
          organization_id: this.organizationId,
          page,
          per_page: perPage,
        },
      });

    return response.data;
  }

  public async getInvoice(invoiceId: string): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .get(`/invoices/${invoiceId}`, {
        params: {
          organization_id: this.organizationId,
        },
      });

    return response.data;
  }

  public async getItems(
    page: number = 1,
    perPage: number = 200
  ): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager.getAxiosInstance().get("/items", {
      params: {
        organization_id: this.organizationId,
        page,
        per_page: perPage,
      },
    });

    return response.data;
  }

  public async createInvoice(invoiceData: any): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .post("/invoices", {
        ...invoiceData,
        organization_id: this.organizationId,
      });

    return response.data;
  }

  public async updateInvoice(
    invoiceId: string,
    invoiceData: any
  ): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .put(`/invoices/${invoiceId}`, {
        ...invoiceData,
        organization_id: this.organizationId,
      });

    return response.data;
  }

  public async deleteInvoice(invoiceId: string): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .delete(`/invoices/${invoiceId}`, {
        params: {
          organization_id: this.organizationId,
        },
      });

    return response.data;
  }
}

export function getAuthUrl(config: ZohoConfig): string {
  const scopes = ["ZohoBooks.fullaccess.all"];
  const params = new URLSearchParams({
    scope: scopes.join(","),
    client_id: config.clientId,
    response_type: "code",
    access_type: "offline",
    redirect_uri: config.redirectUri,
  });

  return `https://accounts.zoho.${
    config.region
  }/oauth/v2/auth?${params.toString()}`;
}

export async function createZohoClient(
  config: ZohoConfig,
  grantToken?: string,
  refreshToken?: string
): Promise<ZohoAPI> {
  const authManager = new ZohoAuthManager(config, grantToken, refreshToken);
  await authManager.initialize();
  return new ZohoAPI(authManager);
}
