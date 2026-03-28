import type { FormInstance } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import type { ICreateUserDto, IResetPasswordDto, IUserDto } from "@/types/user";

/**
 * Describes the editable user form values used by the admin workspace.
 */
export interface IUserFormValues extends ICreateUserDto {
    id?: number;
}

/**
 * Defines the props for the password-reset modal.
 */
export interface IResetPasswordModalProps {
    form: FormInstance<IResetPasswordDto>;
    isPending: boolean;
    isVisible: boolean;
    onCancel: () => void;
    onSubmit: (values: IResetPasswordDto) => Promise<void>;
    resettingUser: IUserDto | null;
}

/**
 * Defines the props for the create/edit user modal.
 */
export interface IUserFormModalProps {
    editingUser: IUserDto | null;
    form: FormInstance<IUserFormValues>;
    isPending: boolean;
    isVisible: boolean;
    onCancel: () => void;
    onSubmit: (values: IUserFormValues) => Promise<void>;
    roleOptions: Array<{ label: string; value: string }>;
}

/**
 * Defines the props for the paged user-management table.
 */
export interface IUserManagementTableProps {
    isLoading: boolean;
    pagination: TablePaginationConfig;
    totalCount: number;
    users: IUserDto[];
    onDelete: (user: IUserDto) => void;
    onEdit: (user: IUserDto) => void;
    onPaginationChange: (current: number, pageSize: number) => void;
    onResetPassword: (user: IUserDto) => void;
}
