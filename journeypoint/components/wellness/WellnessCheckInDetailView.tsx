"use client";

import React, { startTransition, useEffect, useEffectEvent, useState } from "react";
import {
    Alert,
    Button,
    Card,
    Empty,
    Input,
    Space,
    Spin,
    Tag,
    Typography,
    message,
} from "antd";
import {
    BulbOutlined,
    SendOutlined,
} from "@ant-design/icons";
import {
    useWellnessActions,
    useWellnessState,
} from "@/providers/wellnessProvider";
import WellnessStatusBadge from "@/components/wellness/WellnessStatusBadge";
import { useStyles } from "@/components/wellness/style/style";
import { WellnessCheckInStatus, type WellnessQuestionDto } from "@/types/wellness/wellness";
import { useRouter } from "next/navigation";

interface WellnessCheckInDetailViewProps {
    checkInId: string;
    backRoute: string;
    readonly?: boolean;
}

/**
 * Renders one wellness check-in detail for the hire to fill out, or for
 * HR facilitators and managers to review (read-only).
 */
const WellnessCheckInDetailView: React.FC<WellnessCheckInDetailViewProps> = ({
    checkInId,
    backRoute,
    readonly = false,
}) => {
    const { styles } = useStyles();
    const router = useRouter();
    const [messageApi, messageContextHolder] = message.useMessage();
    const { getCheckInDetail, saveAnswer, generateAnswerSuggestion, submitCheckIn } =
        useWellnessActions();
    const { checkInDetail, isDetailPending, isMutationPending } = useWellnessState();
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [aiLoadingId, setAiLoadingId] = useState<string | null>(null);

    const loadDetail = useEffectEvent(async (): Promise<void> => {
        const detail = await getCheckInDetail(checkInId);
        if (detail) {
            const existingAnswers: Record<string, string> = {};
            for (const q of detail.questions) {
                existingAnswers[q.id] = q.answerText ?? "";
            }
            setAnswers(existingAnswers);
        }
    });

    useEffect(() => {
        void loadDetail();
    }, [checkInId]);

    const handleSaveAnswer = async (question: WellnessQuestionDto): Promise<void> => {
        const text = answers[question.id] ?? "";
        const result = await saveAnswer({
            checkInId,
            questionId: question.id,
            answerText: text,
        });

        if (!result) {
            messageApi.error("Your answer could not be saved.");
        }
    };

    const handleGenerateSuggestion = async (question: WellnessQuestionDto): Promise<void> => {
        setAiLoadingId(question.id);
        const result = await generateAnswerSuggestion({
            checkInId,
            questionId: question.id,
        });
        setAiLoadingId(null);

        if (!result) {
            messageApi.error("AI suggestion could not be generated.");
            return;
        }

        if (result.aiSuggestedAnswer) {
            setAnswers((prev) => ({ ...prev, [question.id]: result.aiSuggestedAnswer ?? "" }));
        }
    };

    const handleSubmit = async (): Promise<void> => {
        const result = await submitCheckIn({ checkInId });

        if (!result) {
            messageApi.error("The check-in could not be submitted.");
            return;
        }

        messageApi.success("Wellness check-in submitted.");
    };

    if (isDetailPending) {
        return <Spin size="large" />;
    }

    if (!checkInDetail) {
        return (
            <Alert
                type="error"
                showIcon
                title="Check-in could not be loaded."
            />
        );
    }

    const isCompleted = checkInDetail.status === WellnessCheckInStatus.Completed;
    const allAnswered = checkInDetail.questions.every((q) =>
        (answers[q.id] ?? q.answerText ?? "").trim().length > 0,
    );

    return (
        <Space orientation="vertical" size={16} className={styles.pageRoot}>
            {messageContextHolder}

            <div className={styles.detailHeader}>
                <Button
                    type="link"
                    onClick={() => startTransition(() => router.push(backRoute))}
                    className={styles.backLink}
                >
                    ← Back
                </Button>
                <WellnessStatusBadge status={checkInDetail.status} />
            </div>

            <div>
                <Typography.Title level={4}>{checkInDetail.periodLabel} Wellness Check-in</Typography.Title>
                <Typography.Text type="secondary">
                    {checkInDetail.hireFullName}
                    {checkInDetail.hireRoleTitle ? ` · ${checkInDetail.hireRoleTitle}` : ""}
                    {" — Scheduled: "}
                    {new Date(checkInDetail.scheduledDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}
                </Typography.Text>
            </div>

            {isCompleted && checkInDetail.insightSummary && (
                <Card>
                    <Typography.Text strong>AI Insight Summary</Typography.Text>
                    <Typography.Paragraph className={styles.insightBody}>
                        {checkInDetail.insightSummary}
                    </Typography.Paragraph>
                </Card>
            )}

            {checkInDetail.questions.length === 0 ? (
                <Empty description="Questions have not been generated for this check-in yet." />
            ) : (
                checkInDetail.questions.map((question, index) => (
                    <Card key={question.id} size="small">
                        <Space orientation="vertical" className={styles.pageRoot}>
                            <div className={styles.questionRow}>
                                <Tag>{index + 1}</Tag>
                                <Typography.Text strong>{question.questionText}</Typography.Text>
                            </div>

                            {readonly || isCompleted ? (
                                <Typography.Paragraph className={styles.noBottomMargin}>
                                    {question.answerText || <Typography.Text type="secondary">No answer provided.</Typography.Text>}
                                </Typography.Paragraph>
                            ) : (
                                <>
                                    <Input.TextArea
                                        rows={3}
                                        placeholder="Type your answer here..."
                                        value={answers[question.id] ?? ""}
                                        onChange={(e) =>
                                            setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))
                                        }
                                    />

                                    <div className={styles.answerActions}>
                                        <Button
                                            size="small"
                                            icon={<BulbOutlined />}
                                            loading={aiLoadingId === question.id}
                                            onClick={() => void handleGenerateSuggestion(question)}
                                        >
                                            Generate with AI
                                        </Button>
                                        <Button
                                            size="small"
                                            disabled={!(answers[question.id] ?? "").trim()}
                                            onClick={() => void handleSaveAnswer(question)}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Space>
                    </Card>
                ))
            )}

            {!readonly && !isCompleted && checkInDetail.questions.length > 0 && (
                <Button
                    type="primary"
                    icon={<SendOutlined />}
                    loading={isMutationPending}
                    disabled={!allAnswered}
                    onClick={() => void handleSubmit()}
                >
                    Submit Check-in
                </Button>
            )}
        </Space>
    );
};

export default WellnessCheckInDetailView;
