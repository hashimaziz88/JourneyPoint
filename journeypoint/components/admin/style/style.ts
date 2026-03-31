import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, css }) => ({
  shellLayout: css`
    min-height: 100vh;
  `,

  shellSider: css`
    background: ${token.colorBgElevated} !important;
  `,

  siderBrand: css`
    padding: ${token.paddingLG}px;
  `,

  siderTitle: css`
    color: ${token.colorText} !important;
    margin-bottom: ${token.marginXS}px !important;
  `,

  siderText: css`
    color: ${token.colorTextTertiary};
  `,

  shellMenu: css`
    background: transparent;
    border-inline-end: none !important;
  `,

  shellHeader: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${token.margin}px;
    background: transparent !important;
    padding: ${token.padding}px ${token.paddingLG}px !important;
    height: auto !important;
    line-height: 1.2 !important;
  `,

  headerTitle: css`
    margin: 0 !important;
  `,

  shellContent: css`
    padding: ${token.paddingLG}px !important;
  `,

  shellContentCard: css`
    min-height: calc(100vh - 80px);
    border-radius: ${token.borderRadiusLG}px;
    padding: ${token.paddingLG}px;
    background: ${token.colorBgContainer};
    border: 1px solid ${token.colorBorderSecondary};
  `,

  overviewRoot: css`
    width: 100%;
  `,

  managerRoot: css`
    width: 100%;
  `,

  managerHeading: css`
    margin-bottom: ${token.marginXS}px !important;
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
    gap: ${token.paddingSM}px;
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
    margin-bottom: ${token.marginXS}px !important;
  `,

  overviewParagraph: css`
    margin-bottom: 0 !important;
  `,

  overviewCardTitle: css`
    margin-top: ${token.marginXS}px !important;
    margin-bottom: 0 !important;
  `,

  overviewScopeTitle: css`
    margin-top: ${token.marginXS}px !important;
    margin-bottom: ${token.marginXS}px !important;
  `,

  spinnerWrap: css`
    min-height: 100vh;
    width: 100%;
  `,

  statusBar: css`
    display: flex;
    align-items: center;
    gap: ${token.paddingLG}px;
    flex-wrap: wrap;
    padding: ${token.paddingSM}px ${token.padding}px;
    background: ${token.colorBgElevated};
    border-radius: ${token.borderRadius}px;
    border: 1px solid ${token.colorBorderSecondary};
  `,

  statusBarItem: css`
    display: flex;
    flex-direction: column;
    gap: 2px;
  `,

  statusBarDivider: css`
    height: 28px;
    width: 1px;
    background: ${token.colorBorderSecondary};
    flex-shrink: 0;
  `,

  navCard: css`
    height: 100%;
    cursor: pointer;
    transition: border-color 150ms ease-out;

    &:hover {
      border-color: ${token.colorPrimaryBorder};
    }
  `,

  navCardIcon: css`
    font-size: 20px;
    color: ${token.colorTextTertiary};
    margin-bottom: ${token.marginXS}px;
    display: block;
  `,

  navCardTitle: css`
    margin-bottom: ${token.marginXXS}px !important;
    margin-top: ${token.marginXS}px !important;
    font-weight: 600 !important;
  `,

  hostAlert: css`
    margin-bottom: ${token.marginLG}px;
  `,
}));
