import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, css }) => ({
  shellLayout: css`
    min-height: 100vh;
    background:
      radial-gradient(
        circle at top left,
        ${token.colorPrimaryBg},
        transparent 22%
      ),
      radial-gradient(
        circle at bottom right,
        ${token.colorPrimaryBg},
        transparent 18%
      ),
      ${token.colorBgLayout};
    overflow: visible !important;

    :global(.ant-layout) {
      overflow: visible !important;
    }
  `,

  shellSider: css`
    background: ${token.colorBgElevated} !important;
    border-inline-end: 1px solid ${token.colorBorderSecondary};
    overflow: auto;
  `,

  siderBrand: css`
    padding: ${token.paddingLG}px ${token.paddingLG}px ${token.padding}px;
    border-bottom: 1px solid ${token.colorBorderSecondary};
    margin-bottom: ${token.marginXS}px;
  `,

  siderTitle: css`
    margin-bottom: ${token.marginXXS}px !important;
    color: ${token.colorPrimary} !important;
    font-weight: 700 !important;
  `,

  siderText: css`
    color: ${token.colorTextTertiary};
    font-size: ${token.fontSizeSM}px;
  `,

  shellMenu: css`
    background: transparent;
    border-inline-end: none !important;
    padding-inline: ${token.paddingXS}px;

    :global(.ant-menu-item-selected) {
      border-left: 2px solid ${token.colorPrimary};
      background: ${token.colorPrimaryBg} !important;
    }

    :global(.ant-menu-item) {
      border-radius: ${token.borderRadius}px;
      transition: background 150ms ease-out;
    }
  `,

  mobileDrawerRoot: css`
    :global(.ant-drawer-content) {
      background: ${token.colorBgElevated};
    }

    :global(.ant-drawer-header) {
      background: ${token.colorBgElevated};
      border-bottom: 1px solid ${token.colorBorderSecondary};
      padding: ${token.paddingSM}px ${token.paddingSM}px 0;
    }

    :global(.ant-drawer-body) {
      padding: 0;
    }

    :global(.ant-drawer-content-wrapper) {
      max-width: 100vw;
    }
  `,

  mobileDrawerContent: css`
    min-height: 100vh;
    background: ${token.colorBgElevated};
  `,

  mobileMenuButton: css`
    margin-top: 2px;
  `,

  shellHeader: css`
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${token.margin}px;
    background: ${token.colorBgLayout} !important;
    border-bottom: 1px solid ${token.colorBorderSecondary};
    padding: ${token.paddingLG * 1.5}px ${token.paddingXL}px !important;
    height: auto !important;
    line-height: 1.2 !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    @media (max-width: 991px) {
      align-items: flex-start;
      padding: ${token.paddingLG}px ${token.padding}px !important;
    }
  `,

  headerTitle: css`
    margin: 0 !important;
    font-size: ${token.fontSizeHeading4}px !important;
    font-weight: 600 !important;
    color: ${token.colorText} !important;
  `,

  shellContent: css`
    padding: ${token.paddingLG}px !important;
    overflow: visible !important;

    @media (max-width: 991px) {
      padding: ${token.padding}px !important;
    }
  `,

  shellContentCard: css`
    min-height: calc(100vh - 80px);
    padding: ${token.paddingLG}px;
    background: transparent;

    @media (max-width: 991px) {
      min-height: calc(100vh - 68px);
      padding: ${token.padding}px;
    }
  `,

  overviewRoot: css`
    width: 100%;
  `,

  overviewHeroCard: css`
    border: 1px solid ${token.colorBorderSecondary};
    border-radius: ${token.borderRadiusLG}px;
    background:
      radial-gradient(
        circle at 0% 0%,
        rgba(234, 179, 8, 0.16),
        transparent 28%
      ),
      radial-gradient(
        circle at 100% 100%,
        rgba(59, 130, 246, 0.12),
        transparent 26%
      ),
      ${token.colorBgContainer};
  `,

  overviewKicker: css`
    font-size: ${token.fontSizeSM}px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${token.colorPrimary};
  `,

  overviewHeading: css`
    margin-bottom: ${token.marginXXS}px !important;
  `,

  overviewParagraph: css`
    margin-bottom: 0 !important;
  `,

  overviewInlineMeta: css`
    display: inline-block;
    margin-top: ${token.marginSM}px;
  `,

  overviewCardTitle: css`
    margin-top: ${token.marginXS}px !important;
    margin-bottom: ${token.marginXXS}px !important;
  `,

  overviewDetailCard: css`
    border: 1px solid ${token.colorBorderSecondary};
  `,

  overviewFocusCard: css`
    border: 1px dashed ${token.colorPrimaryBorder};
    background: ${token.colorPrimaryBg};
  `,

  brandRow: css`
    margin-bottom: 4px;
  `,

  brandTitleNoMargin: css`
    margin: 0 !important;
  `,
}));
