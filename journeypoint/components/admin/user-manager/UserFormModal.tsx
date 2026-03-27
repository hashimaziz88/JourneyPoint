"use client";

import React from "react";
import { Form, Input, Modal, Select, Switch } from "antd";
import type { FormInstance } from "antd";
import type { ICreateUserDto, IUserDto } from "@/types/user";

export interface IUserFormValues extends ICreateUserDto {
  id?: number;
}

interface IUserFormModalProps {
  editingUser: IUserDto | null;
  form: FormInstance<IUserFormValues>;
  isPending: boolean;
  isVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: IUserFormValues) => Promise<void>;
  roleOptions: Array<{ label: string; value: string }>;
}

/**
 * Renders the create/edit user modal used by the admin workspace.
 */
const UserFormModal: React.FC<IUserFormModalProps> = ({
  editingUser,
  form,
  isPending,
  isVisible,
  onCancel,
  onSubmit,
  roleOptions,
}) => (
  <Modal
    title={editingUser ? "Edit User" : "Create User"}
    open={isVisible}
    onCancel={onCancel}
    onOk={() => form.submit()}
    confirmLoading={isPending}
    okText={editingUser ? "Save Changes" : "Create User"}
  >
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        void onSubmit(values);
      }}
      initialValues={{ isActive: true, roleNames: [] }}
    >
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

      <Form.Item<IUserFormValues>
        label="Active"
        name="isActive"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
    </Form>
  </Modal>
);

export default UserFormModal;
