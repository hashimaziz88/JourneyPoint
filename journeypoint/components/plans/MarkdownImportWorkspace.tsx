"use client";

import React, {
    startTransition,
    useEffect,
    useEffectEvent,
    useMemo,
    useState,
} from "react";
import { Alert, Button, Space, Tabs, Typography, Upload, message } from "antd";
import type { UploadProps } from "antd";
import {
    EyeOutlined,
    RollbackOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import { APP_ROUTES, buildFacilitatorPlanRoute } from "@/routes/auth.routes";
import MarkdownImportPreviewCard from "@/components/plans/MarkdownImportPreviewCard";
import MarkdownImportSourceCard from "@/components/plans/MarkdownImportSourceCard";
import TaskFormModal from "@/components/plans/TaskFormModal";
import { useStyles } from "@/components/plans/style/style";
import {
    useMarkdownImportActions,
    useMarkdownImportState,
} from "@/providers/markdownImportProvider";
import type { OnboardingTaskEditorValues } from "@/types/onboarding-plan/onboarding-plan";
import {
    findImportDraftTask,
} from "@/utils/plans/markdownImport";
import { SAMPLE_IMPORT_MARKDOWN } from "@/constants/plans/import";
import { readFileAsBase64 } from "@/utils/plans/fileUpload";
import { useRouter } from "next/navigation";
import type { MarkdownImportWorkspaceTaskModalState } from "@/types/plans/components";

const { Paragraph, Title } = Typography;

/**
 * Provides the facilitator document-import review and draft-save workspace.
 */
const MarkdownImportWorkspace: React.FC = () => {
    const { styles } = useStyles();
    const router = useRouter();
    const [messageApi, messageContextHolder] = message.useMessage();
    const {
        previewImport,
        removePreviewModule,
        removePreviewTask,
        resetImport,
        saveDraft,
        setPreviewMetadata,
        setSourceContent,
        setSourceFile,
        updatePreviewModule,
        updatePreviewTask,
    } = useMarkdownImportActions();
    const {
        isPreviewPending,
        isSavePending,
        previewPlan,
        sourceContent,
        sourceBase64Content,
        sourceContentType,
        sourceFileName,
    } = useMarkdownImportState();
    const [taskModalState, setTaskModalState] = useState<MarkdownImportWorkspaceTaskModalState | null>(null);
    const [activeTabKey, setActiveTabKey] = useState<string>("source");

    const resetWorkspace = useEffectEvent((): void => {
        resetImport();
    });

    useEffect(() => {
        resetWorkspace();

        return () => {
            resetWorkspace();
        };
    }, []);

    const editingTask = useMemo(
        () =>
            findImportDraftTask(
                previewPlan?.plan,
                taskModalState?.moduleClientKey ?? null,
                taskModalState?.taskClientKey ?? null,
            ),
        [previewPlan?.plan, taskModalState],
    );

    const handlePreview = async (): Promise<void> => {
        const hasTextSource = !!sourceContent.trim();
        const hasBinarySource = !!sourceBase64Content;

        if (!hasTextSource && !hasBinarySource) {
            messageApi.error("Paste source content or upload a supported document first.");
            return;
        }

        const preview = await previewImport();

        if (!preview) {
            messageApi.error("The source document could not be normalized into a plan preview.");
            return;
        }

        if (preview.warnings.length > 0) {
            messageApi.warning(
                "Preview generated with warnings. Review the parsed content before saving.",
            );
            setActiveTabKey("preview");
            return;
        }

        messageApi.success("Preview generated.");
        setActiveTabKey("preview");
    };

    const handleSaveDraft = async (): Promise<void> => {
        if (!previewPlan?.plan) {
            messageApi.error("Generate and review a preview before saving a draft.");
            return;
        }

        if (!previewPlan.canSave) {
            messageApi.error("Resolve the preview issues before saving the draft.");
            return;
        }

        const savedPlan = await saveDraft();

        if (!savedPlan) {
            messageApi.error("The imported onboarding draft could not be saved.");
            return;
        }

        messageApi.success("Draft plan created.");
        startTransition(() => {
            router.push(buildFacilitatorPlanRoute(savedPlan.id));
        });
    };

    const handleTaskSubmit = async (
        values: OnboardingTaskEditorValues,
    ): Promise<void> => {
        if (!taskModalState) {
            return;
        }

        updatePreviewTask(
            taskModalState.moduleClientKey,
            taskModalState.taskClientKey,
            values,
        );
        setTaskModalState(null);
    };

    const handleLoadExample = (): void => {
        setSourceContent(SAMPLE_IMPORT_MARKDOWN, "sample-onboarding-plan.md");
    };

    const uploadProps: UploadProps = {
        accept: ".md,.markdown,.txt,.pdf,.png,.jpg,.jpeg,.webp,text/markdown,text/plain,application/pdf,image/png,image/jpeg,image/webp",
        showUploadList: false,
        beforeUpload: async (file) => {
            const base64Content = await readFileAsBase64(file);
            const isTextFile =
                file.type.startsWith("text/") ||
                file.name.endsWith(".md") ||
                file.name.endsWith(".markdown") ||
                file.name.endsWith(".txt");
            const textContent = isTextFile ? await file.text() : null;

            setSourceFile({
                fileName: file.name,
                contentType: file.type || "application/octet-stream",
                base64Content,
                sourceContent: textContent,
            });
            messageApi.success(`${file.name} loaded for preview.`);
            return Upload.LIST_IGNORE;
        },
    };

    return (
        <Space orientation="vertical" size={24} className={styles.pageRoot}>
            {messageContextHolder}
            <div className={styles.pageHeader}>
                <div>
                    <Title level={2} className={styles.pageHeading}>
                        Create Plan From Document
                    </Title>
                    <Paragraph type="secondary">
                        Upload markdown, text, PDF, or image source material and
                        normalize it into the same reviewable onboarding draft shape used by
                        the manual builder. Nothing is applied automatically. An HR Facilitator
                        must inspect and approve the preview before the draft is created.
                    </Paragraph>
                </div>

                <Space wrap className={styles.pageActions}>
                    <Button
                        icon={<RollbackOutlined />}
                        onClick={() =>
                            startTransition(() => router.push(APP_ROUTES.facilitatorPlans))
                        }
                    >
                        Back to Plan Creation
                    </Button>
                    <Button disabled={isPreviewPending || isSavePending} onClick={handleLoadExample}>Load Example</Button>
                    <Button disabled={isPreviewPending || isSavePending} onClick={resetImport}>Reset</Button>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => void handlePreview()}
                        loading={isPreviewPending}
                        type="primary"
                    >
                        Preview Import
                    </Button>
                    <Button
                        icon={<SaveOutlined />}
                        onClick={() => void handleSaveDraft()}
                        loading={isSavePending}
                        disabled={!previewPlan?.plan || !previewPlan.canSave}
                    >
                        Save Draft
                    </Button>
                </Space>
            </div>

            <Alert
                className={styles.alert}
                type="info"
                showIcon
                title="Backend AI normalization is review-first. Imported content only affects future journeys once the saved draft is later used for enrolment."
            />

            <Tabs
                activeKey={activeTabKey}
                onChange={setActiveTabKey}
                defaultActiveKey="source"
                items={[
                    {
                        key: "source",
                        label: "Source",
                        children: (
                            <MarkdownImportSourceCard
                                sourceContent={sourceContent}
                                sourceContentType={sourceContentType}
                                sourceFileName={sourceFileName}
                                uploadProps={uploadProps}
                                onSourceContentChange={setSourceContent}
                            />
                        ),
                    },
                    {
                        key: "preview",
                        label: previewPlan?.plan ? `Preview (${previewPlan.plan.modules?.length ?? 0} modules)` : "Preview",
                        children: (
                            <MarkdownImportPreviewCard
                                previewPlan={previewPlan}
                                onEditTask={(moduleClientKey, taskClientKey) =>
                                    setTaskModalState({ moduleClientKey, taskClientKey })
                                }
                                onMetadataChange={setPreviewMetadata}
                                onModuleChange={updatePreviewModule}
                                onRemoveModule={removePreviewModule}
                                onRemoveTask={removePreviewTask}
                            />
                        ),
                    },
                ]}
            />

            <TaskFormModal
                editingTask={editingTask}
                isPending={isSavePending}
                isVisible={taskModalState !== null}
                onCancel={() => setTaskModalState(null)}
                onSubmit={handleTaskSubmit}
            />
        </Space>
    );
};

export default MarkdownImportWorkspace;
