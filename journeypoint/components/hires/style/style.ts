import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
  pageRoot: css`
    width: 100%;
  `,

  hireWorkspace: css`
    display: grid;
    grid-template-columns: minmax(260px, 320px) minmax(0, 1fr);
    gap: 20px;
    width: 100%;
    align-items: start;

    @media (max-width: 1100px) {
      grid-template-columns: 1fr;
    }
  `,

  hireSidebar: css`
    width: 100%;
  `,

  hireSidebarSticky: css`
    display: grid;
    gap: 16px;
    position: sticky;
    top: 16px;

    @media (max-width: 1100px) {
      position: static;
    }
  `,

  hireMain: css`
    display: grid;
    gap: 16px;
    width: 100%;
    min-width: 0;
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

  sidebarActions: css`
    width: 100%;

    & > button {
      width: 100%;
      justify-content: center;
      margin-bottom: 8px;
    }
  `,

  sidebarStatGrid: css`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    width: 100%;
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

  tabWarningIcon: css`
    color: ${token.colorWarning};
    margin-right: 6px;
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

  inlineParagraph: css`
    margin-bottom: 0 !important;
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
