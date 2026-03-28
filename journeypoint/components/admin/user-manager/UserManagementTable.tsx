"use client";

import React from "react";
import { Button, Space, Table, Tag } from "antd";
import { LockOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { IUserDto } from "@/types/user";
import { useStyles } from "@/components/admin/style/style";
import type { IUserManagementTableProps } from "@/types/admin/userManager";

/**
 * Renders the paged user table and row-level actions for the admin workspace.
 */
const UserManagementTable: React.FC<IUserManagementTableProps> = ({
  isLoading,
  pagination,
  totalCount,
  users,
  onDelete,
  onEdit,
  onPaginationChange,
  onResetPassword,
}) => {
  const { styles } = useStyles();

  const columns: ColumnsType<IUserDto> = [
    {
      title: "Name",
      key: "fullName",
      render: (_, user) =>
        user.fullName ?? `${user.name ?? ""} ${user.surname ?? ""}`.trim(),
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
          <Button
            type="link"
            icon={<LockOutlined />}
            onClick={() => onResetPassword(user)}
          >
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
    <Table
      className={styles.responsiveTable}
      rowKey={(record) => String(record.id)}
      columns={columns}
      dataSource={users}
      loading={isLoading}
      scroll={{ x: "max-content" }}
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: totalCount,
        onChange: onPaginationChange,
      }}
    />
  );
};

export default UserManagementTable;
