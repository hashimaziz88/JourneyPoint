import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css }) => ({
  shellLayout: css`
    min-height: 100vh;
  `,

  shellSider: css`
    background: #0f1117 !important;
  `,

  siderBrand: css`
    padding: 24px;
  `,

  siderTitle: css`
    color: #fff !important;
    margin-bottom: 8px !important;
  `,

  siderText: css`
    color: rgba(255, 255, 255, 0.65);
  `,

  shellMenu: css`
    background: transparent;
    border-inline-end: none !important;
  `,

  shellHeader: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    background: transparent !important;
    padding: 16px 24px !important;
    height: auto !important;
    line-height: 1.2 !important;
  `,

  headerTitle: css`
    margin: 0 !important;
  `,

  shellContent: css`
    padding: 24px !important;
  `,

  shellContentCard: css`
    min-height: calc(100vh - 120px);
    border-radius: 16px;
    padding: 24px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
  `,

  overviewRoot: css`
    width: 100%;
  `,

  managerRoot: css`
    width: 100%;
  `,

  managerHeading: css`
    margin-bottom: 8px !important;
  `,

  toolbar: css`
    width: 100%;
    justify-content: space-between;
  `,

  searchInput: css`
    width: 260px;
  `,

  filterSelect: css`
    width: 160px;
  `,

  permissionGrid: css`
    display: grid;
    gap: 8px;
  `,

  responsiveTable: css`
    width: 100%;

    :global(.ant-table-wrapper) {
      width: 100%;
    }

    :global(.ant-table-container) {
      overflow-x: auto;
    }
  `,

  overviewHeading: css`
    margin-bottom: 8px !important;
  `,

  overviewParagraph: css`
    margin-bottom: 0 !important;
  `,

  overviewCardTitle: css`
    margin-top: 8px !important;
    margin-bottom: 0 !important;
  `,

  overviewScopeTitle: css`
    margin-top: 8px !important;
    margin-bottom: 8px !important;
  `,

  spinnerWrap: css`
    min-height: 100vh;
    width: 100%;
  `,
}));
