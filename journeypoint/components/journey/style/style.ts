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

    participantModuleBody: css`
        width: 100%;
    `,

    taskList: css`
        display: grid;
        gap: 12px;
        width: 100%;
    `,

    participantTaskList: css`
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

    taskCardHighlighted: css`
        border-color: ${token.colorInfoBorder};
        box-shadow: 0 0 0 1px ${token.colorInfoBorder};
        background: ${token.colorInfoBg};
    `,

    participantTaskCard: css`
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

    participantTaskHeader: css`
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        width: 100%;

        @media (max-width: 768px) {
            flex-direction: column;
        }
    `,

    taskHeading: css`
        margin-bottom: 8px !important;
    `,

    taskPreview: css`
        margin-bottom: 12px !important;
    `,

    taskLink: css`
        color: ${token.colorPrimary};
        font-weight: 500;
    `,

    taskMetaTags: css`
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    `,

    moduleProgressRow: css`
        display: grid;
        grid-template-columns: minmax(0, 220px) minmax(0, 1fr);
        gap: 16px;
        align-items: center;

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    `,

    progressBar: css`
        width: 100%;
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

    inlineParagraph: css`
        margin-bottom: 0 !important;
    `,

    detailBody: css`
        white-space: pre-wrap;
        margin-bottom: 0 !important;
    `,

    backLink: css`
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        color: ${token.colorPrimary};
        font-weight: 500;
    `,

    fullWidthStack: css`
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

    personalisationPrompt: css`
        width: 100%;
    `,

    personalisationHeader: css`
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        width: 100%;

        @media (max-width: 992px) {
            flex-direction: column;
        }
    `,

    personalisationDiffList: css`
        display: grid;
        gap: 16px;
        width: 100%;
    `,

    personalisationDiffCard: css`
        width: 100%;
    `,

    personalisationDecisionSummary: css`
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        justify-content: flex-end;
    `,

    personalisationDecisionRow: css`
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    `,

    beforeAfterGrid: css`
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        width: 100%;
    `,

    comparisonBlock: css`
        border: 1px solid ${token.colorBorderSecondary};
        border-radius: 12px;
        padding: 16px;
        background: ${token.colorBgLayout};
    `,

    comparisonValuePair: css`
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        margin-top: 12px;

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    `,
}));
