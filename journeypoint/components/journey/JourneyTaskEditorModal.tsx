"use client";

import React, { useEffect } from "react";
import { Button, Form, Input, InputNumber, Modal, Select } from "antd";
import { useStyles } from "@/components/journey/style/style";
import type { IJourneyTaskEditorModalProps } from "@/types/journey/components";
import type {
    IAddJourneyTaskRequest,
    IUpdateJourneyTaskRequest,
} from "@/types/journey";
import {
    ONBOARDING_TASK_ACKNOWLEDGEMENT_RULE_OPTIONS,
    ONBOARDING_TASK_ASSIGNMENT_TARGET_OPTIONS,
    ONBOARDING_TASK_CATEGORY_OPTIONS,
} from "@/types/onboarding-plan";
import { mapJourneyTaskToEditorValues } from "@/utils/journey/taskEditor";

const { TextArea } = Input;

/**
 * Captures facilitator draft-task additions and edits before activation.
 */
const JourneyTaskEditorModal: React.FC<IJourneyTaskEditorModalProps> = ({
    isOpen,
    isPending,
    journey,
    onCancel,
    onSubmit,
    task,
}) => {
    const { styles } = useStyles();
    const [form] = Form.useForm<IAddJourneyTaskRequest | IUpdateJourneyTaskRequest>();

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        form.setFieldsValue(mapJourneyTaskToEditorValues(task));
    }, [form, isOpen, task]);

    return (
        <Modal
            title={task ? "Edit Draft Task" : "Add Draft Task"}
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
                    {task ? "Save Changes" : "Add Task"}
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={(values) => void onSubmit(values)}
                initialValues={mapJourneyTaskToEditorValues(task)}
            >
                <div className={styles.formGrid}>
                    <Form.Item
                        label="Module title"
                        name="moduleTitle"
                        rules={[{ required: true, message: "Enter the module title." }]}
                    >
                        <Input placeholder="Week 1 Foundations" />
                    </Form.Item>

                    <Form.Item
                        label="Module order"
                        name="moduleOrderIndex"
                        rules={[{ required: true, message: "Enter the module order index." }]}
                    >
                        <InputNumber className={styles.fullWidth} min={1} />
                    </Form.Item>

                    <Form.Item
                        label="Task title"
                        name="title"
                        rules={[{ required: true, message: "Enter the task title." }]}
                    >
                        <Input placeholder="Meet your manager" />
                    </Form.Item>

                    <Form.Item
                        label="Task order"
                        name="taskOrderIndex"
                        rules={[{ required: true, message: "Enter the task order index." }]}
                    >
                        <InputNumber className={styles.fullWidth} min={1} />
                    </Form.Item>

                    <Form.Item
                        className={styles.fullWidth}
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: "Enter the task description." }]}
                    >
                        <TextArea rows={4} placeholder="Describe the expected activity or outcome." />
                    </Form.Item>

                    <Form.Item label="Category" name="category" rules={[{ required: true }]}>
                        <Select options={ONBOARDING_TASK_CATEGORY_OPTIONS} />
                    </Form.Item>

                    <Form.Item
                        label="Assignment target"
                        name="assignmentTarget"
                        rules={[{ required: true }]}
                    >
                        <Select options={ONBOARDING_TASK_ASSIGNMENT_TARGET_OPTIONS} />
                    </Form.Item>

                    <Form.Item
                        label="Acknowledgement rule"
                        name="acknowledgementRule"
                        rules={[{ required: true }]}
                    >
                        <Select options={ONBOARDING_TASK_ACKNOWLEDGEMENT_RULE_OPTIONS} />
                    </Form.Item>

                    <Form.Item
                        label="Due day offset"
                        name="dueDayOffset"
                        rules={[{ required: true, message: "Enter the due day offset." }]}
                        extra={
                            journey
                                ? `Calculated from the hire start date: ${journey.hireStartDate.slice(0, 10)}`
                                : undefined
                        }
                    >
                        <InputNumber className={styles.fullWidth} min={0} />
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
};

export default JourneyTaskEditorModal;
