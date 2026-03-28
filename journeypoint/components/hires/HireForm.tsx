"use client";

import React, { useEffect } from "react";
import dayjs from "dayjs";
import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import type { ICreateHireRequest } from "@/types/hire";
import type { IHireFormProps, IHireFormValues } from "@/types/hire/components";
import { useStyles } from "@/components/hires/style/style";

/**
 * Captures the facilitator input required to enrol one hire.
 */
const HireForm: React.FC<IHireFormProps> = ({
    isOpen,
    isPending,
    managerOptions,
    onCancel,
    onSubmit,
    planOptions,
}) => {
    const { styles } = useStyles();
    const [form] = Form.useForm<IHireFormValues>();

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        form.resetFields();
    }, [form, isOpen]);

    const handleFinish = async (values: IHireFormValues): Promise<void> => {
        const payload: ICreateHireRequest = {
            onboardingPlanId: values.onboardingPlanId,
            fullName: values.fullName.trim(),
            emailAddress: values.emailAddress.trim(),
            roleTitle: values.roleTitle?.trim() || null,
            department: values.department?.trim() || null,
            startDate: values.startDate.format("YYYY-MM-DD[T]00:00:00"),
            managerUserId: values.managerUserId,
        };

        await onSubmit(payload);
    };

    return (
        <Modal
            title="Enrol Hire"
            open={isOpen}
            onCancel={onCancel}
            destroyOnClose
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={isPending}
                    onClick={() => void form.submit()}
                >
                    Create Hire
                </Button>,
            ]}
        >
            <Form<IHireFormValues>
                form={form}
                layout="vertical"
                onFinish={(values) => void handleFinish(values)}
                initialValues={{
                    startDate: dayjs(),
                }}
            >
                <div className={styles.formGrid}>
                    <Form.Item
                        className={styles.fullWidth}
                        label="Published plan"
                        name="onboardingPlanId"
                        rules={[{ required: true, message: "Select a published onboarding plan." }]}
                    >
                        <Select
                            placeholder="Choose the plan to generate from"
                            options={planOptions.map((plan) => ({
                                label: plan.name,
                                value: plan.id,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Full name"
                        name="fullName"
                        rules={[{ required: true, message: "Enter the hire's full name." }]}
                    >
                        <Input placeholder="Jordan Example" />
                    </Form.Item>

                    <Form.Item
                        label="Email address"
                        name="emailAddress"
                        rules={[
                            { required: true, message: "Enter the hire's email address." },
                            { type: "email", message: "Enter a valid email address." },
                        ]}
                    >
                        <Input placeholder="jordan@example.com" />
                    </Form.Item>

                    <Form.Item label="Role title" name="roleTitle">
                        <Input placeholder="Support Consultant" />
                    </Form.Item>

                    <Form.Item label="Department" name="department">
                        <Input placeholder="Customer Success" />
                    </Form.Item>

                    <Form.Item
                        label="Start date"
                        name="startDate"
                        rules={[{ required: true, message: "Choose the onboarding start date." }]}
                    >
                        <DatePicker className={styles.fullWidth} format="YYYY-MM-DD" />
                    </Form.Item>

                    <Form.Item label="Manager" name="managerUserId">
                        <Select
                            allowClear
                            placeholder="Optional manager association"
                            options={managerOptions.map((manager) => ({
                                label: `${manager.displayName} (${manager.emailAddress})`,
                                value: manager.id,
                            }))}
                        />
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
};

export default HireForm;
