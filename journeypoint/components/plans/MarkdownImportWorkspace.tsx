"use client";

import React, {
    startTransition,
    useEffect,
    useEffectEvent,
    useMemo,
    useState,
} from "react";
import {
    Alert,
    Button,
    Card,
    Empty,
    Input,
    InputNumber,
    Space,
    Typography,
    Upload,
    message,
} from "antd";
import type { UploadProps } from "antd";
import {
    EyeOutlined,
    InboxOutlined,
    RollbackOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import {
    APP_ROUTES,
    buildFacilitatorPlanRoute,
} from "@/constants/auth/routes";
import MarkdownPreviewTable from "@/components/plans/MarkdownPreviewTable";
import MarkdownImportWarnings from "@/components/plans/MarkdownImportWarnings";
import TaskFormModal from "@/components/plans/TaskFormModal";
import { useStyles } from "@/components/plans/style/style";
import {
    useMarkdownImportActions,
    useMarkdownImportState,
} from "@/providers/markdownImportProvider";
import type {
    IOnboardingPlanDraft,
    IOnboardingTaskDraft,
    IOnboardingTaskEditorValues,
} from "@/types/onboarding-plan";
import { useRouter } from "next/navigation";

const { Paragraph, Text, Title } = Typography;

const readFileAsBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result !== "string") {
                reject(new Error("The uploaded file could not be read."));
                return;
            }

            const base64Content = reader.result.includes(",")
                ? reader.result.split(",")[1]
                : reader.result;
            resolve(base64Content);
        };

        reader.onerror = () => {
            reject(new Error("The uploaded file could not be read."));
        };

        reader.readAsDataURL(file);
    });

const SAMPLE_MARKDOWN = `# Graduate Cohort Programme
Description: Multi-week onboarding for the graduate cohort.
Target Audience: Graduate hires
Duration Days: 21

## Week 1 - Orientation
Welcome activities and first-day setup.

| Title | Description | Category | Due | Assigned To | Acknowledgement |
| --- | --- | --- | --- | --- | --- |
| Collect laptop | Confirm device handover and login credentials. | Orientation | 0 | Facilitator | Required |
| Meet your manager | Introductory session with the line manager. | CheckIn | 1 | Manager | Not Required |
`;

interface ITaskModalState {
    moduleClientKey: string;
    taskClientKey: string;
}

const findDraftTask = (
    draftPlan: IOnboardingPlanDraft | null | undefined,
    moduleClientKey: string | null,
    taskClientKey: string | null,
): IOnboardingTaskDraft | null => {
    if (!draftPlan || !moduleClientKey || !taskClientKey) {
        return null;
    }

    const parentModule = draftPlan.modules.find(
        (module) => module.clientKey === moduleClientKey,
    );

    return parentModule?.tasks.find((task) => task.clientKey === taskClientKey) ?? null;
};

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
    const [taskModalState, setTaskModalState] = useState<ITaskModalState | null>(
        null,
    );

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
            findDraftTask(
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
            messageApi.warning("Preview generated with warnings. Review the parsed content before saving.");
            return;
        }

        messageApi.success("Preview generated.");
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
        values: IOnboardingTaskEditorValues,
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
        setSourceContent(SAMPLE_MARKDOWN, "sample-onboarding-plan.md");
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
                        normalize it into the same reviewable onboarding draft shape
                        used by the manual builder. Nothing is applied
                        automatically. A facilitator must inspect and approve the
                        preview before the draft is created.
                    </Paragraph>
                </div>

                <Space wrap className={styles.pageActions}>
                    <Button
                        icon={<RollbackOutlined />}
                        onClick={() =>
                            startTransition(() =>
                                router.push(APP_ROUTES.facilitatorPlans),
                            )
                        }
                    >
                        Back to Plan Creation
                    </Button>
                    <Button onClick={handleLoadExample}>Load Example</Button>
                    <Button onClick={resetImport}>Reset</Button>
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

            <div className={styles.importGrid}>
                <Card className={styles.importSourceCard}>
                    <Space orientation="vertical" size={16} className={styles.pageRoot}>
                        <div>
                            <Title level={4}>Source Document</Title>
                            <Paragraph type="secondary">
                                Start with whatever source material you have. Clean
                                markdown still previews fastest, but rough markdown,
                                text, PDFs, and image documents can be normalized on
                                the backend into the required draft shape for review.
                            </Paragraph>
                        </div>

                        <Upload.Dragger {...uploadProps}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Drop a document here or click to load one.
                            </p>
                            <p className="ant-upload-hint">
                                Review is mandatory before any draft is created.
                            </p>
                        </Upload.Dragger>

                        {sourceFileName ? (
                            <Text type="secondary">
                                Loaded file: {sourceFileName}
                                {sourceContentType ? ` (${sourceContentType})` : ""}
                            </Text>
                        ) : null}

                        <Input.TextArea
                            className={styles.importTextArea}
                            value={sourceContent}
                            onChange={(event) =>
                                setSourceContent(event.target.value, sourceFileName)
                            }
                            placeholder="Paste onboarding source text here. Typing here replaces any uploaded binary file as the active preview source."
                            rows={18}
                        />
                    </Space>
                </Card>

                <Card className={styles.importPreviewCard}>
                    <Space orientation="vertical" size={16} className={styles.pageRoot}>
                        <div>
                            <Title level={4}>Preview and Review</Title>
                            <Paragraph type="secondary">
                                Edit the parsed metadata, remove bad rows, and fix task
                                content before saving the import as a draft plan.
                            </Paragraph>
                        </div>

                        {previewPlan?.plan ? (
                            <>
                                <div className={styles.metadataGrid}>
                                    <Input
                                        value={previewPlan.plan.name}
                                        onChange={(event) =>
                                            setPreviewMetadata({
                                                name: event.target.value,
                                            })
                                        }
                                        placeholder="Plan name"
                                        maxLength={200}
                                    />
                                    <Input
                                        value={previewPlan.plan.targetAudience}
                                        onChange={(event) =>
                                            setPreviewMetadata({
                                                targetAudience: event.target.value,
                                            })
                                        }
                                        placeholder="Target audience"
                                        maxLength={200}
                                    />
                                    <InputNumber
                                        min={1}
                                        precision={0}
                                        value={previewPlan.plan.durationDays}
                                        onChange={(value) =>
                                            setPreviewMetadata({
                                                durationDays: value ?? 1,
                                            })
                                        }
                                    />
                                    <Input value="Draft preview" disabled />
                                    <Input.TextArea
                                        className={styles.fullWidthField}
                                        value={previewPlan.plan.description}
                                        onChange={(event) =>
                                            setPreviewMetadata({
                                                description: event.target.value,
                                            })
                                        }
                                        placeholder="Plan description"
                                        rows={5}
                                        maxLength={4000}
                                    />
                                </div>

                                <MarkdownImportWarnings
                                    warnings={previewPlan.warnings}
                                />

                                {previewPlan.canSave ? null : (
                                    <Alert
                                        className={styles.alert}
                                        type="warning"
                                        showIcon
                                        title="This preview still has missing required values. Resolve the highlighted issues before saving."
                                    />
                                )}

                                <MarkdownPreviewTable
                                    modules={previewPlan.plan.modules}
                                    onEditTask={(moduleClientKey, taskClientKey) =>
                                        setTaskModalState({
                                            moduleClientKey,
                                            taskClientKey,
                                        })
                                    }
                                    onModuleChange={updatePreviewModule}
                                    onRemoveModule={removePreviewModule}
                                    onRemoveTask={removePreviewTask}
                                />
                            </>
                        ) : (
                            <Empty
                                className={styles.emptyState}
                                description="Generate a preview to review parsed plan content."
                            />
                        )}
                    </Space>
                </Card>
            </div>

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
