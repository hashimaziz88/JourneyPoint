import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, css }) => ({
  shellLayout: css`
    min-height: 100vh;
    background:
      radial-gradient(circle at top left, ${token.colorPrimaryBg}, transparent 28%),
      ${token.colorBgLayout};
  `,

  shellSider: css`
    background: ${token.colorBgElevated} !important;
    border-inline-end: 1px solid ${token.colorBorderSecondary};
  `,

  siderBrand: css`
    padding: ${token.paddingLG}px;
  `,

  siderTitle: css`
    margin-bottom: ${token.marginXXS}px !important;
  `,

  siderText: css`
    color: ${token.colorTextDescription};
  `,

  shellMenu: css`
    background: transparent;
    border-inline-end: none !important;
    padding-inline: ${token.paddingXS}px;
  `,

  shellHeader: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${token.margin}px;
    background: transparent !important;
    padding: ${token.paddingLG}px !important;
    height: auto !important;
    line-height: 1.2 !important;
  `,

  headerTitle: css`
    margin: 0 !important;
  `,

  shellContent: css`
    padding: 0 ${token.paddingLG}px ${token.paddingLG}px !important;
  `,

  shellContentCard: css`
    min-height: calc(100vh - 120px);
    border-radius: ${token.borderRadiusLG}px;
    padding: ${token.paddingLG}px;
    background: ${token.colorBgContainer};
    border: 1px solid ${token.colorBorderSecondary};
    box-shadow: ${token.boxShadowTertiary};
  `,

  overviewRoot: css`
    width: 100%;
  `,

  overviewHeading: css`
    margin-bottom: ${token.marginXXS}px !important;
  `,

  overviewParagraph: css`
    margin-bottom: 0 !important;
  `,

  overviewCardTitle: css`
    margin-top: ${token.marginXS}px !important;
    margin-bottom: ${token.marginXXS}px !important;
  `,
}));
