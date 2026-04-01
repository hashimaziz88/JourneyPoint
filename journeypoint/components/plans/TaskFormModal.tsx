"use client";

import React, { useEffect } from "react";
import { Form, Input, InputNumber, Modal, Select } from "antd";
import {
    OnboardingTaskEditorValues,
} from "@/types/onboarding-plan/onboarding-plan"
import {
    DEFAULT_ONBOARDING_TASK_EDITOR_VALUES,
    ONBOARDING_TASK_ACKNOWLEDGEMENT_RULE_OPTIONS,
    ONBOARDING_TASK_ASSIGNMENT_TARGET_OPTIONS,
    ONBOARDING_TASK_CATEGORY_OPTIONS,
} from "@/constants/plans/onboarding-plan";
import type { TaskFormModalProps } from "@/types/plans/components";

/**
 * Captures onboarding task fields for create and edit flows.
 */
const TaskFormModal: React.FC<TaskFormModalProps> = ({
    editingTask,
    isPending,
    isVisible,
    onCancel,
    onSubmit,
}) => {
    const [form] = Form.useForm<OnboardingTaskEditorValues>();

    useEffect(() => {
        if (!isVisible) {
            return;
        }

        if (!editingTask) {
            form.setFieldsValue(DEFAULT_ONBOARDING_TASK_EDITOR_VALUES);
            return;
        }

        form.setFieldsValue({
            title: editingTask.title,
            description: editingTask.description,
            category: editingTask.category,
            dueDayOffset: editingTask.dueDayOffset,
            assignmentTarget: editingTask.assignmentTarget,
            acknowledgementRule: editingTask.acknowledgementRule,
        });
    }, [editingTask, form, isVisible]);

    const handleSubmit = async (): Promise<void> => {
        const values = await form.validateFields();
        await onSubmit(values);
        form.resetFields();
    };

    return (
        <Modal
            title={editingTask ? "Edit Task" : "Add Task"}
            open={isVisible}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            onOk={() => void handleSubmit()}
            okText={editingTask ? "Save Changes" : "Add Task"}
            confirmLoading={isPending}
            destroyOnHidden
        >
            <Form
                layout="vertical"
                form={form}
                initialValues={DEFAULT_ONBOARDING_TASK_EDITOR_VALUES}
            >
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: "Task title is required." }]}
                >
                    <Input maxLength={200} />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: "Task description is required." }]}
                >
                    <Input.TextArea rows={4} maxLength={4000} />
                </Form.Item>

                <Form.Item
                    label="Category"
                    name="category"
                    rules={[{ required: true, message: "Task category is required." }]}
                >
                    <Select options={ONBOARDING_TASK_CATEGORY_OPTIONS} />
                </Form.Item>

                <Form.Item
                    label="Due Day Offset"
                    name="dueDayOffset"
                    rules={[{ required: true, message: "Due day offset is required." }]}
                >
                    <InputNumber min={0} precision={0} />
                </Form.Item>

                <Form.Item
                    label="Assigned To"
                    name="assignmentTarget"
                    rules={[{ required: true, message: "Task owner is required." }]}
                >
                    <Select options={ONBOARDING_TASK_ASSIGNMENT_TARGET_OPTIONS} />
                </Form.Item>

                <Form.Item
                    label="Acknowledgement"
                    name="acknowledgementRule"
                    rules={[{ required: true, message: "Acknowledgement rule is required." }]}
                >
                    <Select options={ONBOARDING_TASK_ACKNOWLEDGEMENT_RULE_OPTIONS} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TaskFormModal;
