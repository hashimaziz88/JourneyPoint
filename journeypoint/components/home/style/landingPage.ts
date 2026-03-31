import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, css }) => ({
  landingRoot: css`
    min-height: 100vh;
    background: ${token.colorBgLayout};
    display: flex;
    flex-direction: column;
  `,

  landingNav: css`
    position: sticky;
    top: 0;
    z-index: 100;
    background: ${token.colorBgLayout};
    border-bottom: 1px solid ${token.colorBorderSecondary};
    padding: 0 ${token.paddingLG * 2}px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    flex-shrink: 0;

    @media (max-width: 768px) {
      padding: 0 ${token.paddingLG}px;
    }
  `,

  navBrand: css`
    display: flex;
    align-items: center;
    gap: ${token.paddingSM}px;
    text-decoration: none;
  `,

  navBrandText: css`
    font-weight: 700;
    font-size: ${token.fontSizeLG}px;
    color: ${token.colorPrimary} !important;
    margin: 0 !important;
  `,

  navActions: css`
    display: flex;
    align-items: center;
    gap: ${token.marginSM}px;
  `,

  heroSection: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 96px ${token.paddingLG * 2}px 80px;
    min-height: calc(100vh - 64px);
    background: radial-gradient(ellipse 80% 50% at 50% 0%, ${token.colorPrimaryBg}, transparent);

    @media (max-width: 768px) {
      padding: 64px ${token.paddingLG}px 56px;
      min-height: auto;
    }
  `,

  heroEyebrow: css`
    display: inline-flex;
    align-items: center;
    gap: ${token.paddingXS}px;
    background: ${token.colorPrimaryBg};
    border: 1px solid ${token.colorPrimaryBorder};
    border-radius: 100px;
    padding: 4px ${token.paddingSM}px;
    margin-bottom: ${token.marginLG}px;
    font-size: ${token.fontSizeSM}px;
    color: ${token.colorPrimary};
    font-weight: 500;
  `,

  heroTitle: css`
    font-size: 56px !important;
    line-height: 1.1 !important;
    font-weight: 700 !important;
    max-width: 760px;
    margin-bottom: ${token.marginLG}px !important;
    letter-spacing: -0.02em;

    @media (max-width: 768px) {
      font-size: 36px !important;
    }
  `,

  heroSubtitle: css`
    font-size: ${token.fontSizeLG}px !important;
    max-width: 580px;
    margin-bottom: ${token.marginLG * 2}px !important;
    color: ${token.colorTextSecondary} !important;
    line-height: 1.6 !important;
  `,

  heroCtas: css`
    display: flex;
    gap: ${token.margin}px;
    flex-wrap: wrap;
    justify-content: center;
  `,

  featureSection: css`
    padding: 96px ${token.paddingLG * 2}px;
    background: ${token.colorBgContainer};
    border-top: 1px solid ${token.colorBorderSecondary};

    @media (max-width: 768px) {
      padding: 64px ${token.paddingLG}px;
    }
  `,

  sectionLabel: css`
    text-align: center;
    font-size: ${token.fontSizeSM}px !important;
    font-weight: 600 !important;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${token.colorPrimary} !important;
    margin-bottom: ${token.marginSM}px !important;
  `,

  sectionTitle: css`
    text-align: center;
    margin-bottom: ${token.marginLG * 2}px !important;
    font-weight: 700 !important;
  `,

  featureCard: css`
    height: 100%;
    border-color: ${token.colorBorderSecondary};
    background: ${token.colorBgElevated};
    transition: border-color 200ms ease-out;

    &:hover {
      border-color: ${token.colorPrimaryBorder};
    }
  `,

  featureIcon: css`
    font-size: 28px;
    color: ${token.colorTextTertiary};
    margin-bottom: ${token.margin}px;
  `,

  featureCardTitle: css`
    margin-bottom: ${token.marginXS}px !important;
    font-weight: 600 !important;
  `,

  statSection: css`
    background: ${token.colorBgElevated};
    padding: 64px ${token.paddingLG * 2}px;
    border-top: 1px solid ${token.colorBorderSecondary};
    border-bottom: 1px solid ${token.colorBorderSecondary};

    @media (max-width: 768px) {
      padding: 48px ${token.paddingLG}px;
    }
  `,

  statItem: css`
    text-align: center;
    padding: ${token.padding}px;
  `,

  statValue: css`
    font-size: 32px !important;
    font-weight: 700 !important;
    color: ${token.colorPrimary} !important;
    margin-bottom: ${token.marginXXS}px !important;
    line-height: 1.2 !important;
  `,

  statLabel: css`
    font-weight: 600 !important;
    margin-bottom: ${token.marginXXS}px !important;
  `,

  ctaSection: css`
    padding: 96px ${token.paddingLG * 2}px;
    text-align: center;
    background: ${token.colorBgContainer};

    @media (max-width: 768px) {
      padding: 64px ${token.paddingLG}px;
    }
  `,

  ctaTitle: css`
    font-weight: 700 !important;
    margin-bottom: ${token.marginSM}px !important;
  `,

  ctaSubtitle: css`
    color: ${token.colorTextSecondary} !important;
    margin-bottom: ${token.marginLG * 2}px !important;
    max-width: 480px;
    margin-inline: auto;
  `,

  pageFooter: css`
    padding: ${token.paddingLG}px ${token.paddingLG * 2}px;
    border-top: 1px solid ${token.colorBorderSecondary};
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: ${token.marginSM}px;

    @media (max-width: 768px) {
      flex-direction: column;
      text-align: center;
      padding: ${token.padding}px ${token.paddingLG}px;
    }
  `,

  footerBrand: css`
    display: flex;
    align-items: center;
    gap: ${token.paddingXS}px;
  `,

  footerBrandText: css`
    font-weight: 600;
    font-size: ${token.fontSize}px;
    color: ${token.colorPrimary} !important;
    margin: 0 !important;
  `,
}));
