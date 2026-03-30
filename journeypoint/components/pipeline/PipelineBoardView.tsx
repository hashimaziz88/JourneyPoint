"use client";

import React, { startTransition, useEffect, useEffectEvent, useMemo, useState } from "react";
import {
    Button,
    Card,
    Empty,
    Input,
    Select,
    Space,
    Spin,
    Statistic,
    Typography,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import PipelineKanban from "@/components/pipeline/PipelineKanban";
import { useStyles } from "@/components/pipeline/style/style";
import {
    buildFacilitatorHireJourneyRoute,
    buildFacilitatorHireRoute,
} from "@/constants/auth/routes";
import {
    DEFAULT_PIPELINE_QUERY_STATE,
    PIPELINE_CLASSIFICATION_OPTIONS,
} from "@/constants/pipeline/filters";
import { usePipelineActions, usePipelineState } from "@/providers/pipelineProvider";
import type { EngagementClassification } from "@/types/engagement";
import type { IPipelineBoardViewProps } from "@/types/pipeline/components";
import { formatDisplayDateTime } from "@/utils/date";
import { getPipelineSummaryMetrics } from "@/utils/pipeline/board";
import { useRouter } from "next/navigation";

const { Paragraph, Title } = Typography;

/**
 * Renders the facilitator pipeline page with backend-driven columns and filters.
 */
const PipelineBoardView: React.FC<IPipelineBoardViewProps> = () => {
    const { styles } = useStyles();
    const router = useRouter();
    const { board, filters, isPending } = usePipelineState();
    const { getBoard, resetFilters, setFilters } = usePipelineActions();
    const [keywordInput, setKeywordInput] = useState(filters.keyword);
    const [classificationInput, setClassificationInput] = useState<
        EngagementClassification | undefined
    >(filters.classification);
    const summary = useMemo(() => getPipelineSummaryMetrics(board), [board]);

    const loadBoard = useEffectEvent(async (): Promise<void> => {
        await getBoard(filters);
    });

    useEffect(() => {
        void loadBoard();
    }, [filters]);

    const handleApplyFilters = (): void => {
        setFilters({
            keyword: keywordInput,
            classification: classificationInput,
        });
    };

    const handleResetFilters = (): void => {
        setKeywordInput(DEFAULT_PIPELINE_QUERY_STATE.keyword);
        setClassificationInput(DEFAULT_PIPELINE_QUERY_STATE.classification);
        resetFilters();
    };

    const handleOpenHire = (hireId: string): void => {
        startTransition(() => {
            router.push(buildFacilitatorHireRoute(hireId));
        });
    };

    const handleOpenJourney = (hireId: string): void => {
        startTransition(() => {
            router.push(buildFacilitatorHireJourneyRoute(hireId));
        });
    };

    const boardContent = isPending && !board ? (
        <Spin size="large" className={styles.loadingWrap} />
    ) : (board?.columns ?? []).length > 0 ? (
        <PipelineKanban
            columns={board?.columns ?? []}
            onOpenHire={handleOpenHire}
            onOpenJourney={handleOpenJourney}
        />
    ) : (
        <Empty
            className={styles.emptyState}
            description="No hires matched the current pipeline filters."
        />
    );

    return (
        <Space orientation="vertical" size={24} className={styles.pageRoot}>
            <div className={styles.pageHeader}>
                <div>
                    <Title level={2} className={styles.pageHeading}>
                        Pipeline Board
                    </Title>
                    <Paragraph type="secondary">
                        Track same-tenant hire progress through backend-derived module
                        stages, spot at-risk hires quickly, and drill straight into hire
                        or journey review detail.
                    </Paragraph>
                </div>

                <div className={styles.pageActions}>
                    <Button
                        icon={<ReloadOutlined />}
                        loading={isPending}
                        onClick={() => void getBoard(filters)}
                    >
                        Refresh
                    </Button>
                </div>
            </div>

            <div className={styles.summaryGrid}>
                <Card>
                    <Statistic title="Hires in board" value={summary.totalHires} />
                </Card>
                <Card>
                    <Statistic title="Active at-risk flags" value={summary.activeAtRiskCount} />
                </Card>
                <Card>
                    <Statistic
                        title="Average completion"
                        value={summary.averageCompletionRate}
                        precision={0}
                        suffix="%"
                    />
                </Card>
                <Card>
                    <Statistic
                        title="Average engagement score"
                        value={summary.averageCompositeScore}
                        precision={0}
                        suffix="%"
                    />
                </Card>
            </div>

            <Card>
                <div className={styles.filterRow}>
                    <Input.Search
                        placeholder="Search by hire, email, department, role, or plan"
                        value={keywordInput}
                        onChange={(event) => setKeywordInput(event.target.value)}
                        onSearch={handleApplyFilters}
                    />
                    <Select
                        allowClear
                        placeholder="Engagement band"
                        options={PIPELINE_CLASSIFICATION_OPTIONS}
                        value={classificationInput}
                        onChange={(value) =>
                            setClassificationInput(value as EngagementClassification | undefined)
                        }
                    />
                    <Button onClick={handleApplyFilters}>Apply Filters</Button>
                    <Button onClick={handleResetFilters}>Reset</Button>
                </div>
            </Card>

            <div className={styles.boardMeta}>
                <Paragraph type="secondary">
                    Backend generated this view at{" "}
                    {formatDisplayDateTime(board?.generatedAt) || "not yet available"}.
                </Paragraph>
                <Paragraph type="secondary">
                    Columns remain in backend order so the board always reflects the
                    underlying onboarding modules plus the completion lane.
                </Paragraph>
            </div>

            {boardContent}
        </Space>
    );
};

export default PipelineBoardView;
