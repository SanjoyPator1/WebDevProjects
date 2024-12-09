import {
  ContactData,
  ContactEmailData,
  ContactStatusResponse,
  PortalAccessData,
  StatementEmailData,
  Track1099Response,
} from "@/types/contacts.types";
import { CreditNoteData, CreditNoteRefundData } from "@/types/creditNote.types";
import {
  CustomerPaymentData,
  CustomerRefundData,
  InvoiceData,
  PaymentData,
} from "@/types/payment.types";
import { CustomerRefund, RefundListParams } from "@/types/refund.types";
import {
  ApiResponse,
  ContactSearchParams,
  OrganizationsResponse,
  PaginationParams,
  TokenInfo,
  TokenResponse,
  ZohoConfig,
} from "@/types/zoho.types";
import axios, { AxiosInstance, AxiosResponse } from "axios";

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

  // ----- READ Contacts section -------

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

  public async getContact(contactId: string): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .get(`/contacts/${contactId}`, {
        params: {
          organization_id: this.organizationId,
        },
      });

    return response.data;
  }

  public async getContactAddresses(
    contactId: string
  ): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .get(`/contacts/${contactId}/address`, {
        params: {
          organization_id: this.organizationId,
        },
      });

    return response.data;
  }

  public async getContactComments(
    contactId: string,
    params: PaginationParams = {}
  ): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .get(`/contacts/${contactId}/comments`, {
        params: {
          organization_id: this.organizationId,
          page: params.page || 1,
          per_page: params.per_page || 200,
        },
      });

    return response.data;
  }

  public async getContactRefunds(
    contactId: string,
    params: RefundListParams = {}
  ): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .get(`/contacts/${contactId}/refunds`, {
        params: {
          organization_id: this.organizationId,
          page: params.page || 1,
          per_page: params.per_page || 200,
          sort_column: params.sort_column,
          sort_order: params.sort_order,
        },
      });

    return response.data;
  }

  public async searchContacts(
    params: ContactSearchParams = {}
  ): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .get("/contacts", {
        params: {
          organization_id: this.organizationId,
          page: params.page || 1,
          per_page: params.per_page || 200,
          contact_name: params.contact_name,
          company_name: params.company_name,
          first_name: params.first_name,
          last_name: params.last_name,
          email: params.email,
          phone: params.phone,
          filter_by: params.filter_by,
          search_text: params.search_text,
          sort_column: params.sort_column,
        },
      });

    return response.data;
  }

  public async getStatementEmailContent(
    contactId: string,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const params: any = {
      organization_id: this.organizationId,
    };

    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const response = await this.authManager
      .getAxiosInstance()
      .get(`/contacts/${contactId}/statements/email`, { params });

    return response.data;
  }

  // ----- CREATE Contacts section -------
  public async createContact(
    contactData: ContactData
  ): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    console.log(
      "createContact lib entered with data contactData ",
      contactData
    );

    const response = await this.authManager
      .getAxiosInstance()
      .post("/contacts", {
        ...contactData,
        organization_id: this.organizationId,
      });

    console.log("create contact lib response : ", response.data);

    return response.data;
  }

  public async createContactPerson(
    contactId: string,
    contactPersonData: any
  ): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .post(`/contacts/${contactId}/contact_persons`, {
        ...contactPersonData,
        organization_id: this.organizationId,
      });

    return response.data;
  }

  public async addContactAddress(
    contactId: string,
    addressData: any
  ): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .post(`/contacts/${contactId}/address`, {
        ...addressData,
        organization_id: this.organizationId,
      });

    return response.data;
  }

  public async sendStatementEmail(
    contactId: string,
    emailData: StatementEmailData,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const params: any = {
      organization_id: this.organizationId,
    };

    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const response = await this.authManager
      .getAxiosInstance()
      .post(`/contacts/${contactId}/statements/email`, emailData, { params });

    return response.data;
  }

  public async sendContactEmail(
    contactId: string,
    emailData: ContactEmailData,
    sendCustomerStatement: boolean = false
  ): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    // If there are attachments, use multipart/form-data
    if (emailData.attachments) {
      const formData = new FormData();
      formData.append("to_mail_ids", JSON.stringify(emailData.to_mail_ids));
      formData.append("subject", emailData.subject);
      formData.append("body", emailData.body);
      formData.append("attachments", emailData.attachments);

      return this.authManager
        .getAxiosInstance()
        .post(`/contacts/${contactId}/email`, formData, {
          params: {
            organization_id: this.organizationId,
            send_customer_statement: sendCustomerStatement,
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
    }

    // If no attachments, use JSON
    return this.authManager.getAxiosInstance().post(
      `/contacts/${contactId}/email`,
      {
        to_mail_ids: emailData.to_mail_ids,
        subject: emailData.subject,
        body: emailData.body,
      },
      {
        params: {
          organization_id: this.organizationId,
          send_customer_statement: sendCustomerStatement,
        },
      }
    );
  }

  public async markContactActive(
    contactId: string
  ): Promise<ApiResponse<ContactStatusResponse>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .post(`/contacts/${contactId}/active`, null, {
        params: {
          organization_id: this.organizationId,
        },
      });

    return response.data;
  }

  public async markContactInactive(
    contactId: string
  ): Promise<ApiResponse<ContactStatusResponse>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .post(`/contacts/${contactId}/inactive`, null, {
        params: {
          organization_id: this.organizationId,
        },
      });

    return response.data;
  }

  public async enablePortalAccess(
    contactId: string,
    data: PortalAccessData
  ): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .post(`/contacts/${contactId}/portal/enable`, data, {
        params: {
          organization_id: this.organizationId,
        },
      });

    return response.data;
  }

  public async enablePaymentReminders(
    contactId: string
  ): Promise<ApiResponse<ContactStatusResponse>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .post(`/contacts/${contactId}/paymentreminder/enable`, null, {
        params: {
          organization_id: this.organizationId,
        },
      });

    return response.data;
  }

  public async disablePaymentReminders(
    contactId: string
  ): Promise<ApiResponse<ContactStatusResponse>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .post(`/contacts/${contactId}/paymentreminder/disable`, null, {
        params: {
          organization_id: this.organizationId,
        },
      });

    return response.data;
  }

  public async track1099(
    contactId: string
  ): Promise<ApiResponse<Track1099Response>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .post(`/contacts/${contactId}/track1099`, null, {
        params: {
          organization_id: this.organizationId,
        },
      });

    return response.data;
  }

  public async untrack1099(
    contactId: string
  ): Promise<ApiResponse<Track1099Response>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .post(`/contacts/${contactId}/untrack1099`, null, {
        params: {
          organization_id: this.organizationId,
        },
      });

    return response.data;
  }

  // ----- currencies section -------
  public async getCurrencies(): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .get("/settings/currencies", {
        params: {
          organization_id: this.organizationId,
        },
      });

    return response.data;
  }

  // ----- CREATE REFUNDS  section -------
  public async createRefund(
    refundData: CustomerRefund
  ): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .post(`/customerpayments/${refundData.payment_id}/refunds`, {
        ...refundData,
        organization_id: this.organizationId,
      });

    return response.data;
  }

  public async getCustomerPayments(
    customerId: string,
    params: RefundListParams = {}
  ): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .get("/customerpayments", {
        params: {
          organization_id: this.organizationId,
          customer_id: customerId,
          page: params.page || 1,
          per_page: params.per_page || 200,
        },
      });

    return response.data;
  }

  // ------ invoice section -----------
  public async createInvoice(
    invoiceData: InvoiceData
  ): Promise<ApiResponse<any>> {
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

  public async createPayment(
    paymentData: PaymentData
  ): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .post("/customerpayments", {
        ...paymentData,
        organization_id: this.organizationId,
      });

    return response.data;
  }

  public async getInvoices(customerId: string): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .get("/invoices", {
        params: {
          organization_id: this.organizationId,
          customer_id: customerId,
        },
      });

    return response.data;
  }

  // ----- credit Note section -------
  public async createCreditNote(
    creditNoteData: CreditNoteData
  ): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .post("/creditnotes", {
        ...creditNoteData,
        organization_id: this.organizationId,
      });

    return response.data;
  }

  public async createCreditNoteRefund(
    creditNoteId: string,
    refundData: CreditNoteRefundData
  ): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .post(`/creditnotes/${creditNoteId}/refunds`, {
        ...refundData,
        organization_id: this.organizationId,
      });

    return response.data;
  }

  public async getCreditNotes(customerId: string): Promise<ApiResponse<any>> {
    await this.ensureOrganizationId();
    await this.updateAuthHeader();

    const response = await this.authManager
      .getAxiosInstance()
      .get("/creditnotes", {
        params: {
          organization_id: this.organizationId,
          customer_id: customerId,
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
