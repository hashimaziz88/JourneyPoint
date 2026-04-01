import type { CreateRoleDto } from "@/types/role/role";

/** Describes the editable role form values used by the admin workspace. */
export type RoleFormValues = CreateRoleDto & {
    id?: number;
};
