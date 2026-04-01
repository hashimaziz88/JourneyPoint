export type TenantDto = {
    id?: number;
    tenancyName?: string | null;
    name?: string | null;
    isActive?: boolean;
};

export type CreateTenantDto = {
    tenancyName: string;
    name: string;
    adminEmailAddress: string;
    connectionString?: string | null;
    isActive: boolean;
};

export type GetAllTenantsRequest = {
    keyword?: string | null;
    isActive?: boolean | null;
    skipCount: number;
    maxResultCount: number;
};
