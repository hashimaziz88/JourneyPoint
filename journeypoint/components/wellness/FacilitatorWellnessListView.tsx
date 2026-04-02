"use client";

import React, { startTransition, useEffect, useEffectEvent, useState } from "react";
import {
    Button,
    Card,
    Empty,
    Input,
    Space,
    Spin,
    Table,
    Tag,
    Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useHireActions, useHireState } from "@/providers/hireProvider";
import { buildFacilitatorHireWellnessRoute } from "@/routes/auth.routes";
import { useStyles } from "@/components/wellness/style/style";
import { useRouter } from "next/navigation";
import type { HireListItemDto } from "@/types/hire/hire";

/**
 * Renders the HR facilitator wellness overview — a list of all hires with links
 * to their wellness tracker.
 */
const FacilitatorWellnessListView: React.FC = () => {
    const { styles } = useStyles();
    const router = useRouter();
    const { getHires } = useHireActions();
    const { hires, isListPending, totalCount } = useHireState();
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(1);

    const loadHires = useEffectEvent(async (): Promise<void> => {
        await getHires({
            maxResultCount: 20,
            skipCount: (page - 1) * 20,
            keyword: keyword.trim() || undefined,
        });
    });

    useEffect(() => {
        void loadHires();
    }, [page, keyword]);

    const handleViewWellness = (hireId: string): void => {
        startTransition(() => {
            router.push(buildFacilitatorHireWellnessRoute(hireId));
        });
    };

    const columns: ColumnsType<HireListItemDto> = [
        {
            title: "Hire",
            dataIndex: "fullName",
            key: "fullName",
            render: (name: string, record) => (
                <div>
                    <Typography.Text strong>{name}</Typography.Text>
                    <br />
                    <Typography.Text type="secondary" className={styles.hireSubtext}>
                        {record.roleTitle ?? "—"} · {record.department ?? "—"}
                    </Typography.Text>
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: number) => {
                const labels: Record<number, string> = {
                    1: "Pending",
                    2: "Active",
                    3: "Completed",
                    4: "Exited",
                };
                const colors: Record<number, string> = {
                    1: "default",
                    2: "processing",
                    3: "success",
                    4: "error",
                };
                return <Tag color={colors[status] ?? "default"}>{labels[status] ?? status}</Tag>;
            },
        },
        {
            title: "Start Date",
            dataIndex: "startDate",
            key: "startDate",
            render: (date: string) =>
                new Date(date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                }),
        },
        {
            title: "",
            key: "actions",
            render: (_: unknown, record: HireListItemDto) => (
                <Button size="small" onClick={() => handleViewWellness(record.id)}>
                    View Wellness
                </Button>
            ),
        },
    ];

    return (
        <Space orientation="vertical" size={16} className={styles.pageRoot}>
            <div>
                <Typography.Title level={3}>Wellness Tracker</Typography.Title>
                <Typography.Text type="secondary">
                    Review AI-generated wellness check-ins and hire responses for your active hires.
                </Typography.Text>
            </div>

            <Card>
                <Input.Search
                    placeholder="Search hires..."
                    value={keyword}
                    onSearch={(value) => { setKeyword(value); setPage(1); }}
                    onChange={(e) => setKeyword(e.target.value)}
                    allowClear
                />
            </Card>

            {isListPending ? (
                <Spin size="large" />
            ) : (hires ?? []).length === 0 ? (
                <Empty description="No hires found." />
            ) : (
                <Table
                    dataSource={hires ?? []}
                    columns={columns}
                    rowKey="id"
                    pagination={{
                        current: page,
                        pageSize: 20,
                        total: totalCount ?? 0,
                        onChange: setPage,
                    }}
                />
            )}
        </Space>
    );
};

export default FacilitatorWellnessListView;
