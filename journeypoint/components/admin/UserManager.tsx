"use client";

import React, { useEffect, useEffectEvent, useMemo, useState } from "react";
import { Button, Card, Form, Input, Modal, Select, Space, Typography, message } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import { useStyles } from "@/components/admin/style/style";
import ResetPasswordModal from "@/components/admin/user-manager/ResetPasswordModal";
import UserFormModal from "@/components/admin/user-manager/UserFormModal";
import UserManagementTable from "@/components/admin/user-manager/UserManagementTable";
import { useUserActions, useUserState } from "@/providers/userProvider";
import type { IResetPasswordDto, IUserDto } from "@/types/user";
import { USER_SUCCESS_MESSAGES } from "@/constants/admin/userManager";
import type { IUserFormValues } from "@/types/admin/userManager";
import { buildUserQuery } from "@/utils/admin/userManager";

const { Title, Text } = Typography;

/**
 * Renders the host and tenant user-management workspace.
 */
const UserManager: React.FC = () => {
  const { styles } = useStyles();
  const userState = useUserState();
  const {
    createUser,
    deleteUser,
    getAll,
    getRoles,
    resetPassword,
    updateUser,
  } = useUserActions();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUserDto | null>(null);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [resettingUser, setResettingUser] = useState<IUserDto | null>(null);
  const [awaitingMutation, setAwaitingMutation] = useState<
    "create" | "update" | "delete" | "reset" | null
  >(null);
  const [userForm] = Form.useForm<IUserFormValues>();
  const [resetPasswordForm] = Form.useForm<IResetPasswordDto>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const roleOptions = useMemo(
    () =>
      (userState.availableRoles ?? []).map((role) => ({
        label: role.displayName ?? role.name ?? role.normalizedName ?? "Role",
        value: role.normalizedName ?? role.name ?? "",
      })),
    [userState.availableRoles],
  );

  const loadUsers = useEffectEvent(async (): Promise<void> => {
    await getRoles();
    await getAll(buildUserQuery(searchTerm, activeFilter, pagination));
  });

  const refreshUsers = useEffectEvent(async (): Promise<void> => {
    await getAll(buildUserQuery(searchTerm, activeFilter, pagination));
  });

  useEffect(() => {
    void loadUsers();
  }, [activeFilter, pagination, searchTerm]);

  useEffect(() => {
    if (!awaitingMutation || userState.isPending) {
      return;
    }

    if (userState.isError) {
      messageApi.error("The user operation could not be completed.");
      globalThis.setTimeout(() => setAwaitingMutation(null), 0);
      return;
    }

    if (!userState.isSuccess) {
      return;
    }

    messageApi.success(USER_SUCCESS_MESSAGES[awaitingMutation]);

    globalThis.setTimeout(() => {
      setAwaitingMutation(null);
      setIsUserModalOpen(false);
      setEditingUser(null);
      setIsResetPasswordModalOpen(false);
      setResettingUser(null);
      userForm.resetFields();
      resetPasswordForm.resetFields();
      void refreshUsers();
    }, 0);
  }, [
    activeFilter,
    awaitingMutation,
    messageApi,
    pagination,
    resetPasswordForm,
    searchTerm,
    userForm,
    userState.isError,
    userState.isPending,
    userState.isSuccess,
  ]);

  const onCreate = (): void => {
    setEditingUser(null);
    userForm.setFieldsValue({
      userName: undefined,
      name: undefined,
      surname: undefined,
      emailAddress: undefined,
      password: undefined,
      roleNames: [],
      isActive: true,
    });
    setIsUserModalOpen(true);
  };

  const onEdit = (user: IUserDto): void => {
    setEditingUser(user);
    userForm.setFieldsValue({
      id: user.id,
      userName: user.userName ?? "",
      name: user.name ?? "",
      surname: user.surname ?? "",
      emailAddress: user.emailAddress ?? "",
      roleNames: user.roleNames ?? [],
      isActive: user.isActive ?? true,
    });
    setIsUserModalOpen(true);
  };

  const onResetPassword = (user: IUserDto): void => {
    setResettingUser(user);
    resetPasswordForm.setFieldsValue({
      userId: user.id ?? 0,
      newPassword: "",
    });
    setIsResetPasswordModalOpen(true);
  };

  const onDelete = (user: IUserDto): void => {
    Modal.confirm({
      title: `Delete ${user.fullName ?? user.userName}?`,
      content: "This removes the user from the current scope.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        setAwaitingMutation("delete");
        await deleteUser(user.id ?? 0);
      },
    });
  };

  const handleUserSubmit = async (values: IUserFormValues): Promise<void> => {
    if (editingUser?.id) {
      setAwaitingMutation("update");
      await updateUser({
        id: editingUser.id,
        userName: values.userName,
        name: values.name,
        surname: values.surname,
        emailAddress: values.emailAddress,
        isActive: values.isActive,
        roleNames: values.roleNames,
      });
      return;
    }

    setAwaitingMutation("create");
    await createUser({
      userName: values.userName,
      name: values.name,
      surname: values.surname,
      emailAddress: values.emailAddress,
      isActive: values.isActive,
      roleNames: values.roleNames,
      password: values.password,
    });
  };

  const handleResetPasswordSubmit = async (
    values: IResetPasswordDto,
  ): Promise<void> => {
    setAwaitingMutation("reset");
    await resetPassword(values);
  };

  const refreshWithCurrentFilters = (): void => {
    setPagination((current) => ({ ...current, current: 1 }));
    void getAll(
      buildUserQuery(searchTerm, activeFilter, {
        ...pagination,
        current: 1,
      }),
    );
  };

  return (
    <Space orientation="vertical" size={24} className={styles.managerRoot}>
      {messageContextHolder}
      <div>
        <Title level={2} className={styles.managerHeading}>
          User Management
        </Title>
        <Text type="secondary">
          Manage users for the current host or tenant context, including role
          assignment and password resets.
        </Text>
      </div>

      <Card>
        <Space wrap className={styles.toolbar}>
          <Space wrap>
            <Input.Search
              placeholder="Search users"
              allowClear
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onSearch={refreshWithCurrentFilters}
              className={styles.searchInput}
            />

            <Select
              allowClear
              placeholder="Status"
              value={activeFilter}
              onChange={(value) => setActiveFilter(value)}
              options={[
                { label: "Active", value: true },
                { label: "Inactive", value: false },
              ]}
              className={styles.filterSelect}
            />

            <Button onClick={refreshWithCurrentFilters}>Apply Filters</Button>
          </Space>

          <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
            New User
          </Button>
        </Space>
      </Card>

      <Card>
        <UserManagementTable
          users={userState.users ?? []}
          totalCount={userState.totalCount ?? 0}
          pagination={pagination}
          isLoading={userState.isPending && awaitingMutation === null}
          onEdit={onEdit}
          onDelete={onDelete}
          onResetPassword={onResetPassword}
          onPaginationChange={(current, pageSize) =>
            setPagination({ current, pageSize })
          }
        />
      </Card>

      <UserFormModal
        editingUser={editingUser}
        form={userForm}
        isPending={userState.isPending && awaitingMutation !== null}
        isVisible={isUserModalOpen}
        onCancel={() => {
          setIsUserModalOpen(false);
          setEditingUser(null);
          userForm.resetFields();
        }}
        onSubmit={handleUserSubmit}
        roleOptions={roleOptions}
      />

      <ResetPasswordModal
        form={resetPasswordForm}
        isPending={userState.isPending && awaitingMutation === "reset"}
        isVisible={isResetPasswordModalOpen}
        onCancel={() => {
          setIsResetPasswordModalOpen(false);
          setResettingUser(null);
          resetPasswordForm.resetFields();
        }}
        onSubmit={handleResetPasswordSubmit}
        resettingUser={resettingUser}
      />
    </Space>
  );
};

export default UserManager;
