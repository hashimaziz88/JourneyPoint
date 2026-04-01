"use client";

import React, { useEffect } from "react";
import { Form, Input, InputNumber, Modal, Select } from "antd";
import type {
    ExtractedTaskProposalEditorValues,
} from "@/types/onboarding-document/onboarding-document";
import {
    DEFAULT_EXTRACTED_TASK_PROPOSAL_EDITOR_VALUES,
} from "@/constants/plans/onboarding-document";
import {
    ONBOARDING_TASK_ACKNOWLEDGEMENT_RULE_OPTIONS,
    ONBOARDING_TASK_ASSIGNMENT_TARGET_OPTIONS,
    ONBOARDING_TASK_CATEGORY_OPTIONS,
} from "@/constants/plans/onboarding-plan";
import type { ExtractedProposalEditorModalProps } from "@/types/plans/components";
import { mapProposalToEditorValues } from "@/utils/plans/proposalEditor";

/**
 * Captures facilitator edits before a proposal is updated or accepted.
 */
const ExtractedProposalEditorModal: React.FC<ExtractedProposalEditorModalProps> = ({
    availableModules,
    isPending,
    isVisible,
    mode,
    onCancel,
    onSubmit,
    proposal,
}) => {
    const [form] = Form.useForm<ExtractedTaskProposalEditorValues>();

    useEffect(() => {
        if (!isVisible) {
            return;
        }

        form.setFieldsValue(mapProposalToEditorValues(proposal));
    }, [form, isVisible, proposal]);

    const handleSubmit = async (): Promise<void> => {
        const values = await form.validateFields();
        await onSubmit(values);
        form.resetFields();
    };

    return (
        <Modal
            title={mode === "accept" ? "Accept Proposal" : "Edit Proposal"}
            open={isVisible}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            onOk={() => void handleSubmit()}
            okText={mode === "accept" ? "Accept Proposal" : "Save Changes"}
            confirmLoading={isPending}
            destroyOnHidden
        >
            <Form
                layout="vertical"
                form={form}
                initialValues={DEFAULT_EXTRACTED_TASK_PROPOSAL_EDITOR_VALUES}
            >
                <Form.Item
                    label="Target Module"
                    name="suggestedModuleId"
                    rules={
                        mode === "accept"
                            ? [{ required: true, message: "Select a target module before accepting." }]
                            : []
                    }
                >
                    <Select
                        allowClear
                        placeholder="Choose the module that should receive this task"
                        options={availableModules.map((module) => ({
                            label: module.name,
                            value: module.id,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: "Proposal title is required." }]}
                >
                    <Input maxLength={200} />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: "Proposal description is required." }]}
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

export default ExtractedProposalEditorModal;
