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

  filterRow: css`
    display: grid;
    grid-template-columns: minmax(0, 1fr) 240px auto auto;
    gap: 12px;
    width: 100%;

    @media (max-width: 992px) {
      grid-template-columns: 1fr;
    }
  `,

  boardMeta: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    width: 100%;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
    }
  `,

  kanbanScroller: css`
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(320px, 1fr);
    gap: 16px;
    overflow-x: auto;
    padding-bottom: 8px;
    width: 100%;

    @media (max-width: 992px) {
      grid-auto-columns: minmax(280px, 88vw);
    }
  `,

  columnCard: css`
    height: 100%;
    min-height: 280px;

    .ant-card-body {
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: 100%;
    }
  `,

  columnHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  `,

  columnMeta: css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  `,

  columnList: css`
    display: grid;
    gap: 12px;
    width: 100%;
  `,

  pipelineCard: css`
    border: 1px solid ${token.colorBorderSecondary};
    border-radius: 16px;
    padding: 16px;
    background: ${token.colorBgContainer};
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,

  pipelineCardFlagged: css`
    border-color: ${token.colorErrorBorder};
    box-shadow: 0 0 0 1px ${token.colorErrorBorder};
    background: ${token.colorErrorBg};
  `,

  cardHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  `,

  cardIdentity: css`
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  `,

  cardName: css`
    margin-bottom: 0 !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,

  cardEmail: css`
    font-size: ${token.fontSizeSM}px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,

  cardInlineMeta: css`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
    font-size: ${token.fontSizeSM}px;
  `,

  progressWrap: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,

  progressLabel: css`
    display: flex;
    justify-content: space-between;
    font-size: ${token.fontSizeSM}px;
  `,

  actionRow: css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: auto;
  `,

  loadingWrap: css`
    min-height: 320px;
    width: 100%;
  `,

  emptyState: css`
    width: 100%;
    padding: 48px 0;
  `,

  journeyGroup: css`
    width: 100%;

    &:global(.ant-collapse) {
      border-radius: ${token.borderRadiusLG}px;
    }

    :global(.ant-collapse-header) {
      padding: ${token.paddingMD}px ${token.paddingLG}px !important;
    }

    :global(.ant-collapse-content-box) {
      padding: 0 ${token.paddingLG}px ${token.paddingLG}px !important;
    }
  `,

  journeyGroupList: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  `,

  collapseLabel: css`
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  `,

  collapseLabelTitle: css`
    font-weight: 600;
  `,

  collapseLabelMeta: css`
    font-size: ${token.fontSizeSM}px;
    font-weight: 400;
  `,
}));
