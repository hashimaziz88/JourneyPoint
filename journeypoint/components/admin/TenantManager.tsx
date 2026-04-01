"use client";

import React, { useEffect, useEffectEvent, useState } from "react";
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
import { PlusOutlined } from "@ant-design/icons";
import { useTenantActions, useTenantState } from "@/providers/tenantProvider";
import type { TenantDto } from "@/types/tenant/tenant";
import { useStyles } from "@/components/admin/style/style";
import { TENANT_SUCCESS_MESSAGES } from "@/constants/admin/tenantManager";
import type { TenantFormValues } from "@/types/admin/tenantManager";
import { buildTenantQuery } from "@/utils/admin/tenantManager";
import { ignoreAsyncError } from "@/utils/async";

const { Title, Text } = Typography;

const TenantManager: React.FC = () => {
  const { styles } = useStyles();
  const tenantState = useTenantState();
  const { getAll, createTenant, updateTenant, deleteTenant } = useTenantActions();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<TenantDto | null>(null);
  const [awaitingMutation, setAwaitingMutation] = useState<"create" | "update" | "delete" | null>(null);
  const [form] = Form.useForm<TenantFormValues>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const loadTenants = useEffectEvent(async (): Promise<void> => {
    await getAll(buildTenantQuery(searchTerm, activeFilter, pagination));
  });

  const refreshTenants = useEffectEvent(async (): Promise<void> => {
    await getAll(buildTenantQuery(searchTerm, activeFilter, pagination));
  });

  useEffect(() => {
    loadTenants().catch(ignoreAsyncError);
  }, [activeFilter, pagination, pagination.pageSize, searchTerm]);

  useEffect(() => {
    if (!awaitingMutation || tenantState.isPending) {
      return;
    }

    if (tenantState.isError) {
      messageApi.error("The tenant operation could not be completed.");
      globalThis.setTimeout(() => setAwaitingMutation(null), 0);
      return;
    }

    if (tenantState.isSuccess) {
      const successMessage = TENANT_SUCCESS_MESSAGES[awaitingMutation];

      messageApi.success(successMessage);
      globalThis.setTimeout(() => {
        setAwaitingMutation(null);
        setModalOpen(false);
        setEditingTenant(null);
        form.resetFields();
        refreshTenants().catch(ignoreAsyncError);
      }, 0);
    }
  }, [
    activeFilter,
    awaitingMutation,
    form,
    messageApi,
    pagination,
    pagination.pageSize,
    searchTerm,
    tenantState.isError,
    tenantState.isPending,
    tenantState.isSuccess,
  ]);

  const onCreate = () => {
    setEditingTenant(null);
    form.setFieldsValue({
      tenancyName: undefined,
      name: undefined,
      adminEmailAddress: undefined,
      connectionString: undefined,
      isActive: true,
    });
    setModalOpen(true);
  };

  const onEdit = (tenant: TenantDto) => {
    setEditingTenant(tenant);
    form.setFieldsValue({
      id: tenant.id,
      tenancyName: tenant.tenancyName ?? "",
      name: tenant.name ?? "",
      isActive: tenant.isActive ?? true,
    });
    setModalOpen(true);
  };

  const onDelete = (tenant: TenantDto) => {
    Modal.confirm({
      title: `Delete ${tenant.name}?`,
      content: "This removes the tenant record from the host admin scope.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        setAwaitingMutation("delete");
        await deleteTenant(tenant.id ?? 0);
      },
    });
  };

  const handleSubmit = async (values: TenantFormValues) => {
    if (editingTenant?.id) {
      setAwaitingMutation("update");
      await updateTenant({
        id: editingTenant.id,
        tenancyName: values.tenancyName,
        name: values.name,
        isActive: values.isActive,
      });
      return;
    }

    setAwaitingMutation("create");
    await createTenant({
      tenancyName: values.tenancyName,
      name: values.name,
      adminEmailAddress: values.adminEmailAddress,
      connectionString: values.connectionString,
      isActive: values.isActive,
    });
  };

  const columns: ColumnsType<TenantDto> = [
    {
      title: "Tenant Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tenancy Name",
      dataIndex: "tenancyName",
      key: "tenancyName",
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
      render: (_, tenant) => (
        <Space>
          <Button type="link" onClick={() => onEdit(tenant)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => onDelete(tenant)}>
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
          Tenant Management
        </Title>
        <Text type="secondary">
          Host admins can create, update, and remove tenants from this workspace.
        </Text>
      </div>

      <Card>
        <Space wrap className={styles.toolbar}>
          <Space wrap>
            <Input.Search
              placeholder="Search tenants"
              allowClear
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onSearch={() => {
                setPagination((current) => ({ ...current, current: 1 }));
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
              }}
            >
              Apply Filters
            </Button>
          </Space>

          <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
            New Tenant
          </Button>
        </Space>
      </Card>

      <Card>
        <Table
          className={styles.responsiveTable}
          rowKey={(record) => String(record.id)}
          columns={columns}
          dataSource={tenantState.tenants ?? []}
          loading={tenantState.isPending && !awaitingMutation}
          scroll={{ x: "max-content" }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: tenantState.totalCount ?? 0,
            onChange: (current, pageSize) => setPagination({ current, pageSize }),
          }}
        />
      </Card>

      <Modal
        title={editingTenant ? "Edit Tenant" : "Create Tenant"}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditingTenant(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        confirmLoading={tenantState.isPending && awaitingMutation !== null}
        okText={editingTenant ? "Save Changes" : "Create Tenant"}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ isActive: true }}>
          <Form.Item<TenantFormValues>
            label="Tenant Name"
            name="name"
            rules={[{ required: true, message: "Please enter the tenant name." }]}
          >
            <Input placeholder="Contoso" />
          </Form.Item>

          <Form.Item<TenantFormValues>
            label="Tenancy Name"
            name="tenancyName"
            rules={[{ required: true, message: "Please enter the tenancy name." }]}
          >
            <Input placeholder="contoso" />
          </Form.Item>

          {!editingTenant && (
            <>
              <Form.Item<TenantFormValues>
                label="Admin Email Address"
                name="adminEmailAddress"
                rules={[
                  { required: true, message: "Please enter the admin email address." },
                  { type: "email", message: "Please enter a valid email address." },
                ]}
              >
                <Input placeholder="admin@contoso.com" />
              </Form.Item>

              <Form.Item<TenantFormValues> label="Connection String" name="connectionString">
                <Input.TextArea rows={3} placeholder="Optional custom connection string" />
              </Form.Item>
            </>
          )}

          <Form.Item<TenantFormValues> label="Active" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default TenantManager;
