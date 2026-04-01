"use client";

import React from "react";
import { Form, Input, Modal } from "antd";
import type { ResetPasswordDto } from "@/types/user/user";
import type { ResetPasswordModalProps } from "@/types/admin/userManager";

/**
 * Renders the password-reset modal for the selected user.
 */
const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  form,
  isPending,
  isVisible,
  onCancel,
  onSubmit,
  resettingUser,
}) => (
  <Modal
    title={resettingUser ? `Reset Password for ${resettingUser.fullName ?? resettingUser.userName}` : "Reset Password"}
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
      <Form.Item<ResetPasswordDto> name="userId" hidden>
        <Input type="hidden" />
      </Form.Item>

      <Form.Item<ResetPasswordDto>
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
