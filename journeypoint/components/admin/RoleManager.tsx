"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import { useRoleActions, useRoleState } from "@/providers/roleProvider";
import type { ICreateRoleDto, IFlatPermissionDto, IPermissionDto, IRoleDto } from "@/types/role";
import { useStyles } from "@/components/admin/style/style";

const { Title, Text } = Typography;
const ignoreAsyncError = () => undefined;
const ROLE_SUCCESS_MESSAGES = {
  create: "Role created successfully.",
  update: "Role updated successfully.",
  delete: "Role deleted successfully.",
} as const;

interface IRoleFormValues extends ICreateRoleDto {
  id?: number;
}

const RoleManager: React.FC = () => {
  const { styles } = useStyles();
  const roleState = useRoleState();
  const { createRole, deleteRole, getAll, getAllPermissions, getRoleForEdit, updateRole } = useRoleActions();
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<IRoleDto | null>(null);
  const [awaitingMutation, setAwaitingMutation] = useState<"create" | "update" | "delete" | null>(null);
  const [loadingRoleForEdit, setLoadingRoleForEdit] = useState(false);
  const [form] = Form.useForm<IRoleFormValues>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const availablePermissions = useMemo(
    () => (editingRole ? (roleState.currentRole?.permissions as IFlatPermissionDto[] | null) : roleState.availablePermissions ?? []),
    [editingRole, roleState.availablePermissions, roleState.currentRole?.permissions],
  );

  const permissionOptions = useMemo(
    () =>
      (availablePermissions ?? []).map((permission: IPermissionDto | IFlatPermissionDto) => ({
        label: permission.displayName ?? permission.name ?? "Permission",
        value: permission.name ?? "",
      })),
    [availablePermissions],
  );

  useEffect(() => {
    const loadRoles = async () => {
      await getAllPermissions();
      await getAll({
        keyword: searchTerm || null,
        skipCount: ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 10),
        maxResultCount: pagination.pageSize ?? 10,
      });
    };

    loadRoles().catch(ignoreAsyncError);
  }, [getAll, getAllPermissions, pagination, pagination.pageSize, searchTerm]);

  useEffect(() => {
    if (!awaitingMutation || roleState.isPending) {
      return;
    }

    if (roleState.isError) {
      messageApi.error("The role operation could not be completed.");
      globalThis.setTimeout(() => setAwaitingMutation(null), 0);
      return;
    }

    if (roleState.isSuccess) {
      const successMessage = ROLE_SUCCESS_MESSAGES[awaitingMutation];

      messageApi.success(successMessage);
      globalThis.setTimeout(() => {
        const refreshRoles = async () => {
          await getAll({
            keyword: searchTerm || null,
            skipCount: ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 10),
            maxResultCount: pagination.pageSize ?? 10,
          });
        };

        setAwaitingMutation(null);
        setModalOpen(false);
        setEditingRole(null);
        form.resetFields();
        refreshRoles().catch(ignoreAsyncError);
      }, 0);
    }
  }, [
    awaitingMutation,
    form,
    getAll,
    messageApi,
    pagination,
    pagination.pageSize,
    roleState.isError,
    roleState.isPending,
    roleState.isSuccess,
    searchTerm,
  ]);

  useEffect(() => {
    if (!editingRole || !roleState.currentRole?.role) {
      return;
    }

    form.setFieldsValue({
      id: roleState.currentRole.role.id,
      name: roleState.currentRole.role.name ?? "",
      displayName: roleState.currentRole.role.displayName ?? "",
      description: roleState.currentRole.role.description ?? "",
      grantedPermissions: (roleState.currentRole.grantedPermissionNames ?? []),
    });
  }, [editingRole, form, roleState.currentRole]);

  const onCreate = () => {
    setEditingRole(null);
    form.setFieldsValue({
      name: undefined,
      displayName: undefined,
      description: undefined,
      grantedPermissions: [],
    });
    setModalOpen(true);
  };

  const onEdit = async (role: IRoleDto) => {
    setEditingRole(role);
    setModalOpen(true);
    setLoadingRoleForEdit(true);

    try {
      await getRoleForEdit(role.id ?? 0);
    } finally {
      setLoadingRoleForEdit(false);
    }
  };



  const onDelete = (role: IRoleDto) => {
    Modal.confirm({
      title: `Delete ${role.displayName ?? role.name}?`,
      content: "This removes the role from the current scope.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        setAwaitingMutation("delete");
        await deleteRole(role.id ?? 0);
      },
    });
  };

  const handleSubmit = async (values: IRoleFormValues) => {
    if (editingRole?.id) {
      setAwaitingMutation("update");
      await updateRole({
        id: editingRole.id,
        name: values.name,
        displayName: values.displayName,
        description: values.description,
        grantedPermissions: values.grantedPermissions,
      });
      return;
    }

    setAwaitingMutation("create");
    await createRole({
      name: values.name,
      displayName: values.displayName,
      description: values.description,
      grantedPermissions: values.grantedPermissions,
    });
  };

  const columns: ColumnsType<IRoleDto> = [
    {
      title: "Display Name",
      dataIndex: "displayName",
      key: "displayName",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (value: string | undefined) => value || "No description provided.",
    },
    {
      title: "Permissions",
      dataIndex: "grantedPermissions",
      key: "grantedPermissions",
      render: (permissions: string[] | undefined) => (
        <Tag>{`${permissions?.length ?? 0} permission${permissions?.length === 1 ? "" : "s"}`}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, role) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              onEdit(role).catch(ignoreAsyncError);
            }}
          >
            Edit
          </Button>
          <Button type="link" danger onClick={() => onDelete(role)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Space orientation="vertical" size={24} className={styles.managerRoot}>
      {messageContextHolder}
      <div>
        <Title level={2} className={styles.managerHeading}>
          Role Management
        </Title>
        <Text type="secondary">
          Define role metadata and granted permissions for the current host or tenant scope.
        </Text>
      </div>

      <Card>
        <Space wrap className={styles.toolbar}>
          <Input.Search
            placeholder="Search roles"
            allowClear
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            onSearch={() => {
              setPagination((current) => ({ ...current, current: 1 }));
            }}
            className={styles.searchInput}
          />

          <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
            New Role
          </Button>
        </Space>
      </Card>

      <Card>
        <Table
          rowKey={(record) => String(record.id)}
          columns={columns}
          dataSource={roleState.roles ?? []}
          loading={roleState.isPending && !awaitingMutation}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: roleState.totalCount ?? 0,
            onChange: (current, pageSize) => setPagination({ current, pageSize }),
          }}
        />
      </Card>

      <Modal
        title={editingRole ? "Edit Role" : "Create Role"}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditingRole(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        confirmLoading={roleState.isPending && awaitingMutation !== null}
        okText={editingRole ? "Save Changes" : "Create Role"}
        width={720}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item<IRoleFormValues>
            label="Role Name"
            name="name"
            rules={[{ required: true, message: "Please enter the role name." }]}
          >
            <Input placeholder="Manager" />
          </Form.Item>

          <Form.Item<IRoleFormValues>
            label="Display Name"
            name="displayName"
            rules={[{ required: true, message: "Please enter the display name." }]}
          >
            <Input placeholder="Manager" />
          </Form.Item>

          <Form.Item<IRoleFormValues> label="Description" name="description">
            <Input.TextArea rows={3} placeholder="Describe the role" />
          </Form.Item>

          <Form.Item<IRoleFormValues> label="Granted Permissions" name="grantedPermissions">
            <Checkbox.Group
              disabled={loadingRoleForEdit}
              options={permissionOptions}
              className={styles.permissionGrid}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default RoleManager;
