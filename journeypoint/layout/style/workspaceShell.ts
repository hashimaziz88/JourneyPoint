import { createStyles } from "antd-style";

export const useWorkspaceShellStyles = createStyles(({ token, css }) => ({
  workspaceLayout: css`
    min-height: 100vh;
    background:
      radial-gradient(circle at top left, ${token.colorPrimaryBg}, transparent 22%),
      radial-gradient(circle at bottom right, ${token.colorPrimaryBg}, transparent 18%),
      ${token.colorBgLayout};
  `,

  workspaceHeader: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${token.margin}px;
    height: 60px;
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(26, 26, 36, 0.85);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid ${token.colorBorderSecondary};
    padding-inline: ${token.paddingLG}px;
    flex-shrink: 0;

    @media (max-width: 991px) {
      padding-inline: ${token.padding}px;
    }
  `,

  headerLeft: css`
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  `,

  headerLogo: css`
    display: flex;
    align-items: center;
    gap: ${token.paddingXS}px;
    text-decoration: none;
    flex-shrink: 0;
  `,

  headerLogoText: css`
    font-weight: 700;
    font-size: ${token.fontSize}px;
    color: ${token.colorPrimary} !important;
    margin: 0 !important;
    white-space: nowrap;
  `,

  headerDivider: css`
    width: 1px;
    height: 18px;
    background: ${token.colorBorderSecondary};
    flex-shrink: 0;
  `,

  headerWorkspaceName: css`
    font-size: ${token.fontSizeSM}px;
    color: ${token.colorTextTertiary};
    white-space: nowrap;
    font-weight: 500;
  `,

  headerCenter: css`
    display: flex;
    align-items: center;
    gap: 2px;
    flex: 1;
    padding-inline: ${token.paddingLG}px;

    @media (max-width: 991px) {
      display: none;
    }
  `,

  headerRight: css`
    display: flex;
    align-items: center;
    gap: ${token.marginSM}px;
    flex-shrink: 0;
  `,

  headerUserName: css`
    font-size: ${token.fontSizeSM}px;
    color: ${token.colorTextSecondary};
    white-space: nowrap;

    @media (max-width: 1199px) {
      display: none;
    }
  `,

  navLink: css`
    display: inline-flex;
    align-items: center;
    gap: ${token.paddingXXS}px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 6px ${token.paddingSM}px;
    border-radius: ${token.borderRadius}px;
    font-size: ${token.fontSizeSM}px;
    font-weight: 500;
    color: ${token.colorTextSecondary};
    transition: color 150ms ease-out, background 150ms ease-out;
    white-space: nowrap;
    outline: none;

    &:hover {
      color: ${token.colorText};
      background: ${token.colorBgContainer};
    }
  `,

  navLinkActive: css`
    color: ${token.colorPrimary} !important;
    background: ${token.colorPrimaryBg} !important;
    font-weight: 600 !important;

    &:hover {
      background: ${token.colorPrimaryBgHover} !important;
    }
  `,

  workspaceContent: css`
    padding: ${token.paddingLG}px;

    @media (max-width: 991px) {
      padding: ${token.padding}px;
    }
  `,
}));
