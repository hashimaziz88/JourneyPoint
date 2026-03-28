import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
    pageRoot: css`
        width: 100%;
    `,

    pageHeader: css`
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        width: 100%;

        @media (max-width: 992px) {
            flex-direction: column;
        }
    `,

    pageHeading: css`
        margin-bottom: 8px !important;
    `,

    pageActions: css`
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        justify-content: flex-end;
    `,

    filterRow: css`
        display: grid;
        grid-template-columns: minmax(0, 1fr) 220px auto auto;
        gap: 12px;
        width: 100%;

        @media (max-width: 992px) {
            grid-template-columns: 1fr;
        }
    `,

    cardGrid: css`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 16px;
        width: 100%;
    `,

    cardBody: css`
        display: flex;
        flex-direction: column;
        gap: 16px;
        height: 100%;
    `,

    cardHeader: css`
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
    `,

    statusTags: css`
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 8px;
    `,

    detailMeta: css`
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    `,

    statBlock: css`
        padding: 12px;
        border-radius: 12px;
        background: ${token.colorFillQuaternary};
    `,

    actionRow: css`
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: auto;
    `,

    paginationWrap: css`
        display: flex;
        justify-content: flex-end;
        width: 100%;
    `,

    loadingWrap: css`
        min-height: 320px;
        width: 100%;
    `,

    emptyState: css`
        width: 100%;
        padding: 48px 0;
    `,

    detailGrid: css`
        display: grid;
        grid-template-columns: minmax(0, 1.15fr) minmax(300px, 0.85fr);
        gap: 24px;
        width: 100%;

        @media (max-width: 1200px) {
            grid-template-columns: 1fr;
        }
    `,

    summaryGrid: css`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
        width: 100%;
    `,

    formGrid: css`
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    `,

    fullWidth: css`
        width: 100%;
        grid-column: 1 / -1;
    `,
}));
