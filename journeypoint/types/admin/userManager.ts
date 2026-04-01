import type { FormInstance } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import type { CreateUserDto, ResetPasswordDto, UserDto } from "@/types/user/user";

/** Describes the editable user form values used by the admin workspace. */
export type UserFormValues = CreateUserDto & {
    id?: number;
};

/** Defines the props for the password-reset modal. */
export type ResetPasswordModalProps = {
    form: FormInstance<ResetPasswordDto>;
    isPending: boolean;
    isVisible: boolean;
    onCancel: () => void;
    onSubmit: (values: ResetPasswordDto) => Promise<void>;
    resettingUser: UserDto | null;
};

/** Defines the props for the create/edit user modal. */
export type UserFormModalProps = {
    editingUser: UserDto | null;
    form: FormInstance<UserFormValues>;
    isPending: boolean;
    isVisible: boolean;
    onCancel: () => void;
    onSubmit: (values: UserFormValues) => Promise<void>;
    roleOptions: Array<{ label: string; value: string }>;
};

/** Defines the props for the paged user-management table. */
export type UserManagementTableProps = {
    isLoading: boolean;
    pagination: TablePaginationConfig;
    totalCount: number;
    users: UserDto[];
    onDelete: (user: UserDto) => void;
    onEdit: (user: UserDto) => void;
    onPaginationChange: (current: number, pageSize: number) => void;
    onResetPassword: (user: UserDto) => void;
};
