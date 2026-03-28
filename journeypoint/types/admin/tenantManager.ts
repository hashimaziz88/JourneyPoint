import type { ICreateTenantDto } from "@/types/tenant";

/**
 * Describes the editable tenant form values used by the admin workspace.
 */
export interface ITenantFormValues extends ICreateTenantDto {
    id?: number;
}
