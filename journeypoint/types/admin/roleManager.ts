import type { ICreateRoleDto } from "@/types/role";

/**
 * Describes the editable role form values used by the admin workspace.
 */
export interface IRoleFormValues extends ICreateRoleDto {
    id?: number;
}
