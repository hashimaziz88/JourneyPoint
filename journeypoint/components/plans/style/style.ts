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

  creationGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
    width: 100%;
  `,

  creationCard: css`
    height: 100%;
  `,

  creationCardBody: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: 100%;
  `,

  creationAction: css`
    margin-top: auto;
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

  editorWorkspace: css`
    display: grid;
    grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
    gap: 20px;
    width: 100%;

    @media (max-width: 1200px) {
      grid-template-columns: 1fr;
    }
  `,

  editorSidebar: css`
    position: sticky;
    top: 20px;
    align-self: start;

    @media (max-width: 1200px) {
      position: static;
    }
  `,

  sidebarTitle: css`
    margin-bottom: 6px !important;
  `,

  sidebarHint: css`
    margin-bottom: 0 !important;
  `,

  sidebarStats: css`
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    width: 100%;
  `,

  editorMainPanel: css`
    width: 100%;
  `,

  editorTabs: css`
    width: 100%;

    :global(.ant-tabs-content-holder) {
      padding-top: 8px;
    }
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

  documentPanel: css`
    width: 100%;
  `,

  documentList: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 16px;
    width: 100%;
  `,

  documentCard: css`
    height: 100%;
  `,

  documentCardBody: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: 100%;
  `,

  documentCardHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  `,

  documentStatGrid: css`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  `,

  documentCardActions: css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: auto;
  `,

  reviewGrid: css`
    display: grid;
    grid-template-columns: minmax(280px, 340px) minmax(0, 1fr);
    gap: 24px;
    width: 100%;

    @media (max-width: 1200px) {
      grid-template-columns: 1fr;
    }
  `,

  proposalGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
    width: 100%;
  `,

  proposalCard: css`
    height: 100%;
  `,

  proposalCardBody: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: 100%;
  `,

  proposalCardHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  `,

  proposalMetaTags: css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  `,

  proposalActions: css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: auto;
  `,
}));
