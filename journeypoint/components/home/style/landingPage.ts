import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, css }) => ({
  landingRoot: css`
    min-height: 100vh;
    background:
      radial-gradient(
        circle at 0% 0%,
        rgba(234, 179, 8, 0.14),
        transparent 28%
      ),
      radial-gradient(
        circle at 100% 15%,
        rgba(59, 130, 246, 0.14),
        transparent 24%
      ),
      ${token.colorBgLayout};
    display: flex;
    flex-direction: column;
  `,

  landingNav: css`
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(12, 16, 26, 0.82);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
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
    padding: 56px ${token.paddingLG * 2}px 40px;
    min-height: auto;

    @media (max-width: 768px) {
      padding: 40px ${token.paddingLG}px 28px;
    }
  `,

  heroInner: css`
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    gap: 28px;
    align-items: start;
    max-width: 1200px;
    margin: 0 auto;

    @media (max-width: 992px) {
      grid-template-columns: 1fr;
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
    font-size: 48px !important;
    line-height: 1.1 !important;
    font-weight: 700 !important;
    max-width: 760px;
    margin-bottom: ${token.marginLG}px !important;
    letter-spacing: -0.02em;

    @media (max-width: 768px) {
      font-size: 34px !important;
    }
  `,

  heroSubtitle: css`
    font-size: ${token.fontSizeLG}px !important;
    max-width: 620px;
    margin-bottom: ${token.marginLG}px !important;
    color: ${token.colorTextSecondary} !important;
    line-height: 1.6 !important;
  `,

  heroPanel: css`
    border: 1px solid ${token.colorBorderSecondary};
    border-radius: 16px;
    background: linear-gradient(
      170deg,
      rgba(255, 255, 255, 0.04),
      rgba(255, 255, 255, 0.01)
    );
    padding: 20px;
  `,

  heroPanelTitle: css`
    margin-bottom: ${token.margin}px !important;
  `,

  heroPanelList: css`
    display: grid;
    gap: 12px;
  `,

  heroPanelItem: css`
    display: flex;
    align-items: center;
    gap: 10px;
    color: ${token.colorTextSecondary};
    font-size: ${token.fontSize}px;
  `,

  heroPanelDot: css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${token.colorPrimary};
    flex-shrink: 0;
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
    padding: 24px;
    border-radius: 12px;
    border: 1px solid ${token.colorBorderSecondary};
    border-color: ${token.colorBorderSecondary};
    background: ${token.colorBgElevated};
    transition:
      border-color 200ms ease-out,
      transform 200ms ease-out;

    &:hover {
      border-color: ${token.colorPrimaryBorder};
      transform: translateY(-2px);
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

  featureCardParagraph: css`
    margin-bottom: 0 !important;
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
    text-decoration: none;
  `,

  footerBrandText: css`
    font-weight: 600;
    font-size: ${token.fontSize}px;
    color: ${token.colorPrimary} !important;
    margin: 0 !important;
  `,

  footerMetaText: css`
    font-size: 13px;
  `,
}));
