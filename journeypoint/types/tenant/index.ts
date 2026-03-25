export interface ITenantDto {
    id?: number;
    tenancyName?: string | null;
    name?: string | null;
    isActive?: boolean;
}

export interface ICreateTenantDto {
    tenancyName: string;
    name: string;
    adminEmailAddress: string;
    connectionString?: string | null;
    isActive: boolean;
}

export interface IGetAllTenantsRequest {
    keyword?: string | null;
    isActive?: boolean | null;
    skipCount: number;
    maxResultCount: number;
}
