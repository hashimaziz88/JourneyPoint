import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, css }) => ({
  dashRoot: css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: ${token.marginLG * 2}px;
  `,

  greetingSection: css`
    display: flex;
    flex-direction: column;
    gap: ${token.marginXXS}px;
  `,

  greetingTitle: css`
    margin-bottom: 0 !important;
    font-weight: 700 !important;
  `,

  greetingMeta: css`
    margin-bottom: 0 !important;
  `,

  statsGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: ${token.margin}px;
  `,

  sectionHeading: css`
    margin-bottom: ${token.marginLG}px !important;
    font-weight: 600 !important;
  `,

  featureCard: css`
    height: 100%;
    cursor: pointer;
    transition:
      border-color 180ms ease-out,
      box-shadow 180ms ease-out;

    &:hover {
      border-color: ${token.colorPrimaryBorder};
      box-shadow: 0 0 0 1px ${token.colorPrimaryBorder};
    }
  `,

  featureCardIcon: css`
    font-size: 28px;
    color: ${token.colorPrimary};
    margin-bottom: ${token.margin}px;
    display: block;
  `,

  featureCardTitle: css`
    margin-bottom: ${token.marginXXS}px !important;
    margin-top: ${token.marginXS}px !important;
    font-weight: 600 !important;
  `,

  featureCardDescription: css`
    margin-bottom: ${token.margin}px !important;
    color: ${token.colorTextSecondary};
    line-height: 1.5;
  `,

  featureCardAction: css`
    padding-left: 0;
    font-size: ${token.fontSize}px;
  `,

  quickActionsRow: css`
    display: flex;
    align-items: center;
    gap: ${token.margin}px;
    flex-wrap: wrap;
  `,

  scopeChip: css`
    display: inline-flex;
    align-items: center;
    gap: ${token.paddingXS}px;
    padding: ${token.paddingXS}px ${token.paddingSM}px;
    background: ${token.colorBgElevated};
    border: 1px solid ${token.colorBorderSecondary};
    border-radius: ${token.borderRadius}px;
    font-size: ${token.fontSizeSM}px;
    color: ${token.colorTextSecondary};
  `,

  infoCard: css`
    background: ${token.colorBgElevated};
    border-color: ${token.colorBorderSecondary};
  `,

  infoCardText: css`
    margin-bottom: 0 !important;
    font-size: ${token.fontSizeSM}px;
    color: ${token.colorTextTertiary};
  `,

  scopeChipTag: css`
    margin: 0;
  `,
}));
