"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { LockOutlined, PlusOutlined } from "@ant-design/icons";
import { useUserActions, useUserState } from "@/providers/userProvider";
import type { ICreateUserDto, IResetPasswordDto, IUserDto } from "@/types/user";
import { useStyles } from "@/components/admin/style/style";

const { Title, Text } = Typography;

interface IUserFormValues extends ICreateUserDto {
  id?: number;
}

const UserManager: React.FC = () => {
  const { styles } = useStyles();
  const userState = useUserState();
  const { createUser, deleteUser, getAll, getRoles, resetPassword, updateUser } = useUserActions();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUserDto | null>(null);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [resettingUser, setResettingUser] = useState<IUserDto | null>(null);
  const [awaitingMutation, setAwaitingMutation] = useState<"create" | "update" | "delete" | "reset" | null>(null);
  const [form] = Form.useForm<IUserFormValues>();
  const [resetPasswordForm] = Form.useForm<IResetPasswordDto>();

  const roleOptions = useMemo(
    () =>
      (userState.availableRoles ?? []).map((role) => ({
        label: role.displayName ?? role.name ?? role.normalizedName ?? "Role",
        value: role.normalizedName ?? role.name ?? "",
      })),
    [userState.availableRoles],
  );

  useEffect(() => {
    void getRoles();
    void getAll({
      keyword: searchTerm || null,
      isActive: activeFilter ?? null,
      skipCount: ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 10),
      maxResultCount: pagination.pageSize ?? 10,
    });
  }, [activeFilter, getAll, getRoles, pagination, pagination.pageSize, searchTerm]);

  useEffect(() => {
    if (!awaitingMutation || userState.isPending) {
      return;
    }

    if (userState.isError) {
      message.error("The user operation could not be completed.");
      window.setTimeout(() => setAwaitingMutation(null), 0);
      return;
    }

    if (userState.isSuccess) {
      const successMessage =
        awaitingMutation === "create"
          ? "User created successfully."
          : awaitingMutation === "update"
            ? "User updated successfully."
            : awaitingMutation === "reset"
              ? "Password reset successfully."
              : "User deleted successfully.";

      message.success(successMessage);
      window.setTimeout(() => {
        setAwaitingMutation(null);
        setModalOpen(false);
        setEditingUser(null);
        setResetPasswordModalOpen(false);
        setResettingUser(null);
        form.resetFields();
        resetPasswordForm.resetFields();
        void getAll({
          keyword: searchTerm || null,
          isActive: activeFilter ?? null,
          skipCount: ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 10),
          maxResultCount: pagination.pageSize ?? 10,
        });
      }, 0);
    }
  }, [
    activeFilter,
    awaitingMutation,
    form,
    getAll,
    pagination,
    pagination.pageSize,
    resetPasswordForm,
    searchTerm,
    userState.isError,
    userState.isPending,
    userState.isSuccess,
  ]);

  const onCreate = () => {
    setEditingUser(null);
    form.setFieldsValue({
      userName: undefined,
      name: undefined,
      surname: undefined,
      emailAddress: undefined,
      password: undefined,
      roleNames: [],
      isActive: true,
    });
    setModalOpen(true);
  };

  const onEdit = (user: IUserDto) => {
    setEditingUser(user);
    form.setFieldsValue({
      id: user.id,
      userName: user.userName ?? "",
      name: user.name ?? "",
      surname: user.surname ?? "",
      emailAddress: user.emailAddress ?? "",
      roleNames: user.roleNames ?? [],
      isActive: user.isActive ?? true,
    });
    setModalOpen(true);
  };

  const onResetPassword = (user: IUserDto) => {
    setResettingUser(user);
    resetPasswordForm.setFieldsValue({
      userId: user.id ?? 0,
      newPassword: "",
    });
    setResetPasswordModalOpen(true);
  };

  const onDelete = (user: IUserDto) => {
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

  const handleSubmit = async (values: IUserFormValues) => {
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

  const handleResetPassword = async (values: IResetPasswordDto) => {
    setAwaitingMutation("reset");
    await resetPassword(values);
  };

  const columns: ColumnsType<IUserDto> = [
    {
      title: "Name",
      key: "fullName",
      render: (_, user) => user.fullName ?? `${user.name ?? ""} ${user.surname ?? ""}`.trim(),
    },
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "emailAddress",
      key: "emailAddress",
    },
    {
      title: "Roles",
      dataIndex: "roleNames",
      key: "roleNames",
      render: (roles: string[] | undefined) => (
        <Space wrap>
          {(roles ?? []).map((role) => (
            <Tag key={role}>{role}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (value: boolean | undefined) => (
        <Tag color={value ? "green" : "red"}>{value ? "Active" : "Inactive"}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, user) => (
        <Space wrap>
          <Button type="link" onClick={() => onEdit(user)}>
            Edit
          </Button>
          <Button type="link" icon={<LockOutlined />} onClick={() => onResetPassword(user)}>
            Reset Password
          </Button>
          <Button type="link" danger onClick={() => onDelete(user)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={24} className={styles.managerRoot}>
      <div>
        <Title level={2} className={styles.managerHeading}>
          User Management
        </Title>
        <Text type="secondary">
          Manage users for the current host or tenant context, including role assignment and password resets.
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
              onSearch={() => {
                setPagination((current) => ({ ...current, current: 1 }));
                void getAll({
                  keyword: searchTerm || null,
                  isActive: activeFilter ?? null,
                  skipCount: 0,
                  maxResultCount: pagination.pageSize ?? 10,
                });
              }}
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

            <Button
              onClick={() => {
                setPagination((current) => ({ ...current, current: 1 }));
                void getAll({
                  keyword: searchTerm || null,
                  isActive: activeFilter ?? null,
                  skipCount: 0,
                  maxResultCount: pagination.pageSize ?? 10,
                });
              }}
            >
              Apply Filters
            </Button>
          </Space>

          <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
            New User
          </Button>
        </Space>
      </Card>

      <Card>
        <Table
          rowKey={(record) => String(record.id)}
          columns={columns}
          dataSource={userState.users ?? []}
          loading={userState.isPending && !awaitingMutation}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: userState.totalCount ?? 0,
            onChange: (current, pageSize) => setPagination({ current, pageSize }),
          }}
        />
      </Card>

      <Modal
        title={editingUser ? "Edit User" : "Create User"}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditingUser(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        confirmLoading={userState.isPending && awaitingMutation !== null}
        okText={editingUser ? "Save Changes" : "Create User"}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ isActive: true, roleNames: [] }}>
          <Form.Item<IUserFormValues>
            label="Username"
            name="userName"
            rules={[{ required: true, message: "Please enter the username." }]}
          >
            <Input placeholder="admin" />
          </Form.Item>

          <Form.Item<IUserFormValues>
            label="First Name"
            name="name"
            rules={[{ required: true, message: "Please enter the first name." }]}
          >
            <Input placeholder="Jane" />
          </Form.Item>

          <Form.Item<IUserFormValues>
            label="Last Name"
            name="surname"
            rules={[{ required: true, message: "Please enter the last name." }]}
          >
            <Input placeholder="Doe" />
          </Form.Item>

          <Form.Item<IUserFormValues>
            label="Email Address"
            name="emailAddress"
            rules={[
              { required: true, message: "Please enter the email address." },
              { type: "email", message: "Please enter a valid email address." },
            ]}
          >
            <Input placeholder="jane@example.com" />
          </Form.Item>

          {!editingUser && (
            <Form.Item<IUserFormValues>
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter a password." }]}
            >
              <Input.Password placeholder="Create a password" />
            </Form.Item>
          )}

          <Form.Item<IUserFormValues> label="Roles" name="roleNames">
            <Select mode="multiple" options={roleOptions} placeholder="Select roles" />
          </Form.Item>

          <Form.Item<IUserFormValues> label="Active" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Reset Password${resettingUser ? ` for ${resettingUser.fullName ?? resettingUser.userName}` : ""}`}
        open={resetPasswordModalOpen}
        onCancel={() => {
          setResetPasswordModalOpen(false);
          setResettingUser(null);
          resetPasswordForm.resetFields();
        }}
        onOk={() => resetPasswordForm.submit()}
        confirmLoading={userState.isPending && awaitingMutation === "reset"}
        okText="Reset Password"
      >
        <Form form={resetPasswordForm} layout="vertical" onFinish={handleResetPassword}>
          <Form.Item<IResetPasswordDto> name="userId" hidden>
            <Input type="hidden" />
          </Form.Item>

          <Form.Item<IResetPasswordDto>
            label="New Password"
            name="newPassword"
            rules={[{ required: true, message: "Please enter the new password." }]}
          >
            <Input.Password placeholder="Enter the new password" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default UserManager;
