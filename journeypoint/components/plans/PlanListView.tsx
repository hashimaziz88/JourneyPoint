"use client";

import React, { startTransition, useEffect, useEffectEvent, useState } from "react";
import {
    Button,
    Card,
    Empty,
    Input,
    Pagination,
    Select,
    Space,
    Spin,
    Typography,
    message,
} from "antd";
import { ImportOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import {
    APP_ROUTES,
    buildFacilitatorPlanRoute,
} from "@/constants/auth/routes";
import PlanCard from "@/components/plans/PlanCard";
import { useStyles } from "@/components/plans/style/style";
import {
    IGetOnboardingPlansInput,
    IOnboardingPlanListItemDto,
    ONBOARDING_PLAN_STATUS_LABELS,
    OnboardingPlanStatus,
} from "@/types/onboarding-plan";
import {
    useOnboardingPlanActions,
    useOnboardingPlanState,
} from "@/providers/onboardingPlanProvider";
import { useRouter } from "next/navigation";

const { Paragraph, Title } = Typography;

interface IPlanListQueryState {
    current: number;
    keyword: string;
    maxResultCount: number;
    status?: OnboardingPlanStatus;
}

const DEFAULT_QUERY_STATE: IPlanListQueryState = {
    current: 1,
    keyword: "",
    maxResultCount: 6,
};

const buildPlanListRequest = (
    query: IPlanListQueryState,
): IGetOnboardingPlansInput => ({
    keyword: query.keyword.trim() || null,
    status: query.status ?? null,
    skipCount: (query.current - 1) * query.maxResultCount,
    maxResultCount: query.maxResultCount,
    sorting: "LastUpdatedTime DESC",
});

/**
 * Renders the facilitator-facing onboarding plan index and list actions.
 */
const PlanListView: React.FC = () => {
    const { styles } = useStyles();
    const router = useRouter();
    const [messageApi, messageContextHolder] = message.useMessage();
    const { archivePlan, clonePlan, getPlans, publishPlan } =
        useOnboardingPlanActions();
    const { isListPending, isMutationPending, plans, totalCount } =
        useOnboardingPlanState();
    const [keywordInput, setKeywordInput] = useState("");
    const [statusInput, setStatusInput] = useState<
        OnboardingPlanStatus | undefined
    >(undefined);
    const [query, setQuery] = useState<IPlanListQueryState>(DEFAULT_QUERY_STATE);

    const loadPlans = useEffectEvent(async (): Promise<void> => {
        await getPlans(buildPlanListRequest(query));
    });

    const refreshPlans = async (
        nextQuery: IPlanListQueryState = query,
    ): Promise<void> => {
        await getPlans(buildPlanListRequest(nextQuery));
    };

    useEffect(() => {
        void loadPlans();
    }, [query]);

    const handleOpen = (planId: string): void => {
        startTransition(() => {
            router.push(buildFacilitatorPlanRoute(planId));
        });
    };

    const handleApplyFilters = (): void => {
        setQuery((currentQuery) => ({
            ...currentQuery,
            current: 1,
            keyword: keywordInput,
            status: statusInput,
        }));
    };

    const handleResetFilters = (): void => {
        setKeywordInput("");
        setStatusInput(undefined);
        setQuery(DEFAULT_QUERY_STATE);
    };

    const handleClone = async (
        plan: IOnboardingPlanListItemDto,
    ): Promise<void> => {
        const clonedPlan = await clonePlan({ sourcePlanId: plan.id });

        if (!clonedPlan) {
            messageApi.error("The plan could not be cloned.");
            return;
        }

        messageApi.success("Draft copy created.");
        startTransition(() => {
            router.push(buildFacilitatorPlanRoute(clonedPlan.id));
        });
    };

    const handlePublish = async (
        plan: IOnboardingPlanListItemDto,
    ): Promise<void> => {
        const publishedPlan = await publishPlan(plan.id);

        if (!publishedPlan) {
            messageApi.error("The plan could not be published.");
            return;
        }

        messageApi.success("Plan published.");
        await refreshPlans();
    };

    const handleArchive = async (
        plan: IOnboardingPlanListItemDto,
    ): Promise<void> => {
        const archivedPlan = await archivePlan(plan.id);

        if (!archivedPlan) {
            messageApi.error("The plan could not be archived.");
            return;
        }

        messageApi.success("Plan archived.");
        await refreshPlans();
    };

    const hasPlans = (plans ?? []).length > 0;
    const listContent = isListPending ? (
        <Spin size="large" className={styles.loadingWrap} />
    ) : hasPlans ? (
        <>
            <div className={styles.planGrid}>
                {(plans ?? []).map((plan) => (
                    <PlanCard
                        key={plan.id}
                        isActionPending={isMutationPending}
                        onArchive={handleArchive}
                        onClone={handleClone}
                        onOpen={handleOpen}
                        onPublish={handlePublish}
                        plan={plan}
                    />
                ))}
            </div>

            <div className={styles.paginationWrap}>
                <Pagination
                    current={query.current}
                    pageSize={query.maxResultCount}
                    total={totalCount ?? 0}
                    showSizeChanger
                    onChange={(page, pageSize) =>
                        setQuery((currentQuery) => ({
                            ...currentQuery,
                            current: page,
                            maxResultCount: pageSize,
                        }))
                    }
                />
            </div>
        </>
    ) : (
        <Empty
            className={styles.emptyState}
            description="No onboarding plans match the current filter set."
        />
    );

    return (
        <Space orientation="vertical" size={24} className={styles.pageRoot}>
            {messageContextHolder}
            <div className={styles.pageHeader}>
                <div>
                    <Title level={2} className={styles.pageHeading}>
                        Onboarding Plans
                    </Title>
                    <Paragraph type="secondary">
                        Build reusable onboarding templates, keep modules and tasks
                        in order, and manage lifecycle state for facilitator
                        delivery.
                    </Paragraph>
                </div>

                <Space wrap className={styles.pageActions}>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => void refreshPlans()}
                        loading={isListPending}
                    >
                        Refresh
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => handleOpen("new")}
                    >
                        Create Manually
                    </Button>
                    <Button
                        icon={<ImportOutlined />}
                        onClick={() =>
                            startTransition(() =>
                                router.push(APP_ROUTES.facilitatorPlanImport),
                            )
                        }
                    >
                        Create From Document
                    </Button>
                </Space>
            </div>

            <div className={styles.creationGrid}>
                <Card className={styles.creationCard}>
                    <div className={styles.creationCardBody}>
                        <div>
                            <Title level={4}>Start Manually</Title>
                            <Paragraph type="secondary">
                                Build the draft plan yourself by entering metadata,
                                adding modules, and defining tasks directly in the
                                editor.
                            </Paragraph>
                        </div>

                        <Button
                            className={styles.creationAction}
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => handleOpen("new")}
                        >
                            Open Manual Builder
                        </Button>
                    </div>
                </Card>

                <Card className={styles.creationCard}>
                    <div className={styles.creationCardBody}>
                        <div>
                            <Title level={4}>Start From Markdown or PDF</Title>
                            <Paragraph type="secondary">
                                Upload markdown, text, PDF, or image source material.
                                The backend normalizes it into the same draft-plan DTO
                                shape, and you review the result before any draft is
                                saved.
                            </Paragraph>
                        </div>

                        <Button
                            className={styles.creationAction}
                            icon={<ImportOutlined />}
                            onClick={() =>
                                startTransition(() =>
                                    router.push(APP_ROUTES.facilitatorPlanImport),
                                )
                            }
                        >
                            Open Document Import
                        </Button>
                    </div>
                </Card>
            </div>

            <Card>
                <div className={styles.filtersRow}>
                    <Input.Search
                        placeholder="Search by plan name or audience"
                        value={keywordInput}
                        onChange={(event) => setKeywordInput(event.target.value)}
                        onSearch={handleApplyFilters}
                    />

                    <Select
                        allowClear
                        placeholder="Lifecycle state"
                        value={statusInput}
                        onChange={(value) => setStatusInput(value)}
                        options={Object.values(OnboardingPlanStatus)
                            .filter(
                                (value): value is OnboardingPlanStatus =>
                                    typeof value === "number",
                            )
                            .map((value) => ({
                                label: ONBOARDING_PLAN_STATUS_LABELS[value],
                                value,
                            }))}
                    />

                    <Button onClick={handleApplyFilters}>Apply Filters</Button>
                    <Button onClick={handleResetFilters}>Reset</Button>
                </div>
            </Card>

            {listContent}
        </Space>
    );
};

export default PlanListView;
