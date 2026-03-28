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

    summaryGrid: css`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
        width: 100%;
    `,

    statCard: css`
        width: 100%;
    `,

    sectionCard: css`
        width: 100%;
    `,

    moduleList: css`
        display: grid;
        gap: 16px;
        width: 100%;
    `,

    moduleCard: css`
        width: 100%;
    `,

    taskList: css`
        display: grid;
        gap: 12px;
        width: 100%;
    `,

    taskCard: css`
        border: 1px solid ${token.colorBorderSecondary};
        border-radius: 12px;
        padding: 16px;
        background: ${token.colorBgContainer};
    `,

    taskHeader: css`
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        width: 100%;
    `,

    taskMetaTags: css`
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    `,

    taskActions: css`
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: flex-end;
    `,

    loadingWrap: css`
        min-height: 320px;
        width: 100%;
    `,

    emptyState: css`
        width: 100%;
        padding: 48px 0;
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
