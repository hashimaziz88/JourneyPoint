import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    sectionStack: css`
        width: 100%;
    `,

    statsGrid: css`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 16px;
        width: 100%;
    `,

    trendCard: css`
        width: 100%;
    `,

    trendHeader: css`
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;

        @media (max-width: 768px) {
            flex-direction: column;
        }
    `,

    trendChartWrap: css`
        width: 100%;
        overflow-x: auto;
    `,

    trendSvg: css`
        width: 100%;
        min-width: 360px;
        height: auto;
    `,

    trendLegend: css`
        display: flex;
        justify-content: space-between;
        gap: 12px;
        width: 100%;

        @media (max-width: 768px) {
            flex-direction: column;
        }
    `,

    panelCard: css`
        width: 100%;
    `,

    detailList: css`
        display: grid;
        gap: 12px;
        width: 100%;
    `,

    formStack: css`
        display: grid;
        gap: 12px;
        width: 100%;
    `,

    actionRow: css`
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    `,

    noteText: css`
        white-space: pre-wrap;
        margin-bottom: 0 !important;
    `,

    historyItem: css`
        border: 1px solid ${token.colorBorderSecondary};
        border-radius: 12px;
        padding: 16px;
        background: ${token.colorBgContainer};
    `,

    historyList: css`
        display: grid;
        gap: 12px;
        width: 100%;
    `,

    emptyState: css`
        width: 100%;
        padding: 24px 0;
    `,
}));
