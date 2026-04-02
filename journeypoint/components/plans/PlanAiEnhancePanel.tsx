"use client";

import React, { useState } from "react";
import {
    Alert,
    Button,
    Card,
    Checkbox,
    Collapse,
    Divider,
    Modal,
    Space,
    Tag,
    Typography,
    message,
} from "antd";
import { BulbOutlined, CheckOutlined } from "@ant-design/icons";
import { getAxiosInstance } from "@/utils/axiosInstance";
import { useStyles } from "@/components/plans/style/style";
import type {
    ApplyModuleEnhancement,
    ApplyPlanEnhancementRequest,
    EnhancedModuleProposalDto,
    PlanEnhancementProposalDto,
} from "@/types/plans/enhance";

const PLAN_API = "/api/services/app/OnboardingPlan";

interface PlanAiEnhancePanelProps {
    planId: string;
    onApplied: () => Promise<void>;
}

/**
 * Renders the AI Enhance button and diff-review modal for plan module/task content rewriting.
 */
const PlanAiEnhancePanel: React.FC<PlanAiEnhancePanelProps> = ({ planId, onApplied }) => {
    const { styles } = useStyles();
    const [messageApi, messageContextHolder] = message.useMessage();
    const [isGenerating, setIsGenerating] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [proposal, setProposal] = useState<PlanEnhancementProposalDto | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedModules, setSelectedModules] = useState<Record<string, boolean>>({});
    const [selectedTasks, setSelectedTasks] = useState<Record<string, Record<string, boolean>>>({});

    const handleGenerate = async (): Promise<void> => {
        setIsGenerating(true);
        try {
            const response = await getAxiosInstance().post<{ result: PlanEnhancementProposalDto }>(
                `${PLAN_API}/EnhancePlanWithAi`,
                { id: planId },
            );
            const result = response.data?.result;
            if (!result || result.modules.length === 0) {
                messageApi.warning("AI enhancement returned no suggestions.");
                return;
            }
            setProposal(result);
            const moduleInit: Record<string, boolean> = {};
            const taskInit: Record<string, Record<string, boolean>> = {};
            for (const mod of result.modules) {
                moduleInit[mod.moduleId] = true;
                taskInit[mod.moduleId] = {};
                for (const task of mod.tasks) {
                    taskInit[mod.moduleId][task.taskId] = true;
                }
            }
            setSelectedModules(moduleInit);
            setSelectedTasks(taskInit);
            setIsModalOpen(true);
        } catch {
            messageApi.error("AI enhancement failed. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleApply = async (): Promise<void> => {
        if (!proposal) {
            return;
        }

        setIsApplying(true);
        try {
            const modules: ApplyModuleEnhancement[] = proposal.modules.map((mod) => ({
                moduleId: mod.moduleId,
                applyModuleContent: selectedModules[mod.moduleId] ?? false,
                enhancedName: mod.enhancedName,
                enhancedDescription: mod.enhancedDescription,
                tasks: mod.tasks
                    .filter((t) => selectedTasks[mod.moduleId]?.[t.taskId])
                    .map((t) => ({
                        taskId: t.taskId,
                        enhancedTitle: t.enhancedTitle,
                        enhancedDescription: t.enhancedDescription,
                    })),
            }));

            const request: ApplyPlanEnhancementRequest = { planId, modules };
            await getAxiosInstance().post(`${PLAN_API}/ApplyPlanEnhancement`, request);

            messageApi.success("AI enhancements applied.");
            setIsModalOpen(false);
            setProposal(null);
            await onApplied();
        } catch {
            messageApi.error("Could not apply enhancements. Please try again.");
        } finally {
            setIsApplying(false);
        }
    };

    const toggleModule = (moduleId: string): void => {
        setSelectedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
    };

    const toggleTask = (moduleId: string, taskId: string): void => {
        setSelectedTasks((prev) => ({
            ...prev,
            [moduleId]: { ...(prev[moduleId] ?? {}), [taskId]: !(prev[moduleId]?.[taskId]) },
        }));
    };

    const renderModuleProposal = (mod: EnhancedModuleProposalDto): React.ReactNode => (
        <Space orientation="vertical" className={styles.pageRoot}>
            <Checkbox
                checked={selectedModules[mod.moduleId] ?? false}
                onChange={() => toggleModule(mod.moduleId)}
            >
                <Typography.Text strong>Apply module name & description</Typography.Text>
            </Checkbox>

            {selectedModules[mod.moduleId] && (
                <Card size="small" className={styles.enhanceIndent}>
                    <div>
                        <Tag>Name</Tag>
                        <Typography.Text delete type="secondary">{mod.originalName}</Typography.Text>
                        {" → "}
                        <Typography.Text strong>{mod.enhancedName}</Typography.Text>
                    </div>
                    {mod.originalDescription !== mod.enhancedDescription && (
                        <div className={styles.enhanceDescriptionGap}>
                            <Tag>Description</Tag>
                            <Typography.Paragraph type="secondary" delete className={styles.enhanceParagraphTight}>
                                {mod.originalDescription}
                            </Typography.Paragraph>
                            <Typography.Paragraph className={styles.enhanceParagraphFlush}>
                                {mod.enhancedDescription}
                            </Typography.Paragraph>
                        </div>
                    )}
                </Card>
            )}

            {mod.tasks.length > 0 && (
                <>
                    <Divider className={styles.enhanceDivider} />
                    <Typography.Text type="secondary">Tasks:</Typography.Text>
                    {mod.tasks.map((task) => (
                        <Card key={task.taskId} size="small" className={styles.enhanceIndent}>
                            <Checkbox
                                checked={selectedTasks[mod.moduleId]?.[task.taskId] ?? false}
                                onChange={() => toggleTask(mod.moduleId, task.taskId)}
                            >
                                <div>
                                    <Typography.Text delete type="secondary">{task.originalTitle}</Typography.Text>
                                    {" → "}
                                    <Typography.Text strong>{task.enhancedTitle}</Typography.Text>
                                </div>
                            </Checkbox>
                            {selectedTasks[mod.moduleId]?.[task.taskId] &&
                                task.originalDescription !== task.enhancedDescription && (
                                    <div className={styles.enhanceTaskDiff}>
                                        <Typography.Paragraph type="secondary" delete className={styles.enhanceParagraphTight}>
                                            {task.originalDescription}
                                        </Typography.Paragraph>
                                        <Typography.Paragraph className={styles.enhanceParagraphFlush}>
                                            {task.enhancedDescription}
                                        </Typography.Paragraph>
                                    </div>
                                )}
                        </Card>
                    ))}
                </>
            )}
        </Space>
    );

    return (
        <>
            {messageContextHolder}
            <Button
                icon={<BulbOutlined />}
                loading={isGenerating}
                onClick={() => void handleGenerate()}
            >
                AI Enhance
            </Button>

            <Modal
                title="AI Enhancement Proposals"
                open={isModalOpen}
                width={760}
                onCancel={() => { setIsModalOpen(false); setProposal(null); }}
                footer={
                    <Space>
                        <Button onClick={() => { setIsModalOpen(false); setProposal(null); }}>
                            Discard
                        </Button>
                        <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            loading={isApplying}
                            onClick={() => void handleApply()}
                        >
                            Apply Selected
                        </Button>
                    </Space>
                }
            >
                <Alert
                    type="info"
                    showIcon
                    title="Review the AI-suggested improvements below. Check the items you want to apply, then click Apply Selected."
                    className={styles.enhanceAlertWrap}
                />
                {proposal && (
                    <Collapse
                        items={proposal.modules.map((mod) => ({
                            key: mod.moduleId,
                            label: mod.originalName,
                            children: renderModuleProposal(mod),
                        }))}
                        defaultActiveKey={proposal.modules.map((m) => m.moduleId)}
                    />
                )}
            </Modal>
        </>
    );
};

export default PlanAiEnhancePanel;
