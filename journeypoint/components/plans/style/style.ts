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
    `,

    pageActions: css`
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        justify-content: flex-end;
    `,

    pageHeading: css`
        margin-bottom: 8px !important;
    `,

    filtersRow: css`
        display: grid;
        grid-template-columns: minmax(0, 1fr) 200px auto auto;
        gap: 12px;
        width: 100%;

        @media (max-width: 992px) {
            grid-template-columns: 1fr;
        }
    `,

    planGrid: css`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
        width: 100%;
    `,

    planCard: css`
        height: 100%;
    `,

    planCardBody: css`
        display: flex;
        flex-direction: column;
        gap: 16px;
        height: 100%;
    `,

    planCardHeader: css`
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
    `,

    planCardTitle: css`
        margin-bottom: 8px !important;
    `,

    planStats: css`
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
    `,

    statBlock: css`
        padding: 12px;
        border-radius: 12px;
        background: ${token.colorFillQuaternary};
    `,

    planCardActions: css`
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

    emptyState: css`
        width: 100%;
        padding: 48px 0;
    `,

    loadingWrap: css`
        min-height: 320px;
        width: 100%;
    `,

    editorCard: css`
        width: 100%;
    `,

    metadataGrid: css`
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
        width: 100%;

        @media (max-width: 992px) {
            grid-template-columns: 1fr;
        }
    `,

    fullWidthField: css`
        grid-column: 1 / -1;
    `,

    modulesWrap: css`
        width: 100%;
    `,

    moduleCard: css`
        width: 100%;
    `,

    moduleHeader: css`
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        width: 100%;
    `,

    moduleHeaderActions: css`
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: flex-end;
    `,

    taskRow: css`
        width: 100%;
        border: 1px solid ${token.colorBorderSecondary};
        border-radius: 12px;
        padding: 16px;
        background: ${token.colorBgContainer};
    `,

    taskRowHeader: css`
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

    alert: css`
        width: 100%;
    `,

    importGrid: css`
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 24px;
        width: 100%;

        @media (max-width: 992px) {
            grid-template-columns: 1fr;
        }
    `,

    importSourceCard: css`
        width: 100%;
    `,

    importPreviewCard: css`
        width: 100%;
    `,

    importTextArea: css`
        min-height: 320px !important;
    `,

    warningsList: css`
        margin: 0;
        padding-left: 18px;
    `,

    previewModuleCard: css`
        width: 100%;
    `,

    previewTableWrap: css`
        width: 100%;

        :global(.ant-table-wrapper) {
            width: 100%;
        }
    `,
}));
