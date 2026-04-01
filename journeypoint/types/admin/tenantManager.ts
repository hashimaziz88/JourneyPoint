import type { CreateTenantDto } from "@/types/tenant/tenant";

/** Describes the editable tenant form values used by the admin workspace. */
export type TenantFormValues = CreateTenantDto & {
    id?: number;
};
