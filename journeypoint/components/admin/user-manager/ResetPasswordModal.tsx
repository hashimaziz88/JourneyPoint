"use client";

import React from "react";
import { Form, Input, Modal } from "antd";
import type { FormInstance } from "antd";
import type { IResetPasswordDto, IUserDto } from "@/types/user";

interface IResetPasswordModalProps {
  form: FormInstance<IResetPasswordDto>;
  isPending: boolean;
  isVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: IResetPasswordDto) => Promise<void>;
  resettingUser: IUserDto | null;
}

/**
 * Renders the password-reset modal for the selected user.
 */
const ResetPasswordModal: React.FC<IResetPasswordModalProps> = ({
  form,
  isPending,
  isVisible,
  onCancel,
  onSubmit,
  resettingUser,
}) => (
  <Modal
    title={`Reset Password${resettingUser ? ` for ${resettingUser.fullName ?? resettingUser.userName}` : ""}`}
    open={isVisible}
    onCancel={onCancel}
    onOk={() => form.submit()}
    confirmLoading={isPending}
    okText="Reset Password"
  >
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        void onSubmit(values);
      }}
    >
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
);

export default ResetPasswordModal;
