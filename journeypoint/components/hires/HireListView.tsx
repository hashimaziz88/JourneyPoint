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
    Statistic,
    Typography,
    message,
} from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import HireCard from "@/components/hires/HireCard";
import HireForm from "@/components/hires/HireForm";
import { useStyles } from "@/components/hires/style/style";
import {
    buildFacilitatorHireJourneyRoute,
    buildFacilitatorHireRoute,
} from "@/constants/auth/routes";
import {
    DEFAULT_HIRE_LIST_QUERY_STATE,
    HIRE_STATUS_OPTIONS,
} from "@/constants/hire/list";
import {
    useHireActions,
    useHireState,
} from "@/providers/hireProvider";
import type { ICreateHireRequest, IHireListQueryState } from "@/types/hire";
import type { IHireListViewProps } from "@/types/hire/components";
import { buildHireListRequest } from "@/utils/hire/list";
import { useRouter } from "next/navigation";

const { Paragraph, Title } = Typography;

/**
 * Renders the facilitator-facing hire list, filters, and enrolment entry point.
 */
const HireListView: React.FC<IHireListViewProps> = () => {
    const { styles } = useStyles();
    const router = useRouter();
    const [messageApi, messageContextHolder] = message.useMessage();
    const {
        createHire,
        getHires,
        getManagerOptions,
        getPublishedPlanOptions,
    } = useHireActions();
    const {
        hires,
        isListPending,
        isMutationPending,
        managerOptions,
        planOptions,
        totalCount,
    } = useHireState();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [keywordInput, setKeywordInput] = useState("");
    const [statusInput, setStatusInput] = useState<IHireListQueryState["status"]>(undefined);
    const [query, setQuery] = useState<IHireListQueryState>(DEFAULT_HIRE_LIST_QUERY_STATE);
    const hiresInView = hires ?? [];
    const hiresWithoutJourney = hiresInView.filter((hire) => !hire.journeyId).length;
    const failedWelcomeCount = hiresInView.filter((hire) => hire.welcomeNotificationStatus === 2).length;

    const loadHires = useEffectEvent(async (): Promise<void> => {
        await getHires(buildHireListRequest(query));
    });

    const loadReferenceData = useEffectEvent(async (): Promise<void> => {
        await Promise.all([getPublishedPlanOptions(), getManagerOptions()]);
    });

    useEffect(() => {
        void loadHires();
    }, [query]);

    useEffect(() => {
        void loadReferenceData();
    }, []);

    const refreshHires = async (
        nextQuery: IHireListQueryState = query,
    ): Promise<void> => {
        await getHires(buildHireListRequest(nextQuery));
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
        setQuery(DEFAULT_HIRE_LIST_QUERY_STATE);
    };

    const handleOpenDetail = (hireId: string): void => {
        startTransition(() => {
            router.push(buildFacilitatorHireRoute(hireId));
        });
    };

    const handleOpenJourney = (hireId: string): void => {
        startTransition(() => {
            router.push(buildFacilitatorHireJourneyRoute(hireId));
        });
    };

    const handleCreateHire = async (payload: ICreateHireRequest): Promise<void> => {
        const result = await createHire(payload);

        if (!result) {
            messageApi.error("The hire could not be created.");
            return;
        }

        setIsCreateModalOpen(false);
        await refreshHires();

        if (result.welcomeNotificationFailureReason) {
            messageApi.warning("Hire created, but the welcome notification needs follow-up.");
        } else {
            messageApi.success("Hire enrolled successfully.");
        }

        startTransition(() => {
            router.push(buildFacilitatorHireRoute(result.id));
        });
    };

    let listContent: React.ReactNode;

    if (isListPending) {
        listContent = <Spin size="large" className={styles.loadingWrap} />;
    } else if (hiresInView.length > 0) {
        listContent = (
            <>
                <div className={styles.cardGrid}>
                    {hiresInView.map((hire) => (
                        <HireCard
                            key={hire.id}
                            hire={hire}
                            onOpenDetail={handleOpenDetail}
                            onOpenJourney={handleOpenJourney}
                        />
                    ))}
                </div>

                <div className={styles.paginationWrap}>
                    <Pagination
                        current={query.current}
                        pageSize={query.pageSize}
                        total={totalCount ?? 0}
                        showSizeChanger
                        onChange={(page, pageSize) =>
                            setQuery((currentQuery) => ({
                                ...currentQuery,
                                current: page,
                                pageSize,
                            }))
                        }
                    />
                </div>
            </>
        );
    } else {
        listContent = (
            <Empty
                className={styles.emptyState}
                description="No hires match the current filter set."
            />
        );
    }

    return (
        <Space orientation="vertical" size={24} className={styles.pageRoot}>
            {messageContextHolder}
            <div className={styles.hireWorkspace}>
                <Card className={styles.hireSidebar}>
                    <div className={styles.hireSidebarSticky}>
                        <div>
                            <Title level={3} className={styles.pageHeading}>
                                Hire Management
                            </Title>
                            <Paragraph type="secondary" className={styles.inlineParagraph}>
                                Keep key hire metrics and actions visible while filtering and reviewing results.
                            </Paragraph>
                        </div>

                        <div className={styles.sidebarStatGrid}>
                            <Statistic title="Total hires" value={totalCount ?? 0} />
                            <Statistic title="In current page" value={hiresInView.length} />
                            <Statistic title="Without journey" value={hiresWithoutJourney} />
                            <Statistic title="Welcome follow-up" value={failedWelcomeCount} />
                        </div>

                        <div className={styles.sidebarActions}>
                            <Button
                                icon={<ReloadOutlined />}
                                loading={isListPending}
                                onClick={() => void refreshHires()}
                            >
                                Refresh
                            </Button>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setIsCreateModalOpen(true)}
                            >
                                Enrol Hire
                            </Button>
                        </div>
                    </div>
                </Card>

                <div className={styles.hireMain}>
                    <div className={styles.pageHeader}>
                        <div>
                            <Title level={2} className={styles.pageHeading}>
                                Hire Queue
                            </Title>
                            <Paragraph type="secondary">
                                Filter and triage hires in one focused workspace, then jump directly to hire detail or journey review.
                            </Paragraph>
                        </div>
                    </div>

                    <Card>
                        <div className={styles.filterRow}>
                            <Input.Search
                                placeholder="Search by hire, email, department, or plan"
                                value={keywordInput}
                                onChange={(event) => setKeywordInput(event.target.value)}
                                onSearch={handleApplyFilters}
                            />

                            <Select
                                allowClear
                                placeholder="Lifecycle state"
                                options={HIRE_STATUS_OPTIONS}
                                value={statusInput}
                                onChange={(value) => setStatusInput(value)}
                            />

                            <Button onClick={handleApplyFilters}>Apply Filters</Button>
                            <Button onClick={handleResetFilters}>Reset</Button>
                        </div>
                    </Card>

                    {listContent}
                </div>
            </div>

            <HireForm
                isOpen={isCreateModalOpen}
                isPending={isMutationPending}
                managerOptions={managerOptions ?? []}
                onCancel={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateHire}
                planOptions={planOptions ?? []}
            />
        </Space>
    );
};

export default HireListView;
