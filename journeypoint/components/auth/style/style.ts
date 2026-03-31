import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, css }) => ({
  page: css`
    min-height: 100vh;
    background: ${token.colorBgLayout};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  `,

  card: css`
    width: 100%;
    max-width: 960px;
    border-radius: ${token.borderRadiusLG * 2}px;
    overflow: hidden;
    box-shadow: ${token.boxShadowSecondary};
    border: 1px solid ${token.colorBorderSecondary};

    .ant-card-body {
      padding: 0;
    }
  `,

  heroRow: css`
    min-height: 560px;
  `,

  leftCol: css`
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    background: linear-gradient(
      160deg,
      ${token.colorBgElevated} 0%,
      rgba(245, 158, 11, 0.12) 60%,
      ${token.colorBgLayout} 100%
    );
    border-inline-end: 1px solid ${token.colorBorderSecondary};
    padding: 48px;
  `,

  leftDecorator: css`
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 25% 75%, rgba(245, 158, 11, 0.1), transparent 55%);
    pointer-events: none;
  `,

  rightCol: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: ${token.colorBgContainer};
    padding: 48px;
  `,

  leftContent: css`
    max-width: 420px;
    color: ${token.colorTextBase};
    position: relative;
    z-index: 1;

    h1 {
      color: ${token.colorTextBase} !important;
      margin-bottom: ${token.margin}px;
    }

    .ant-typography {
      color: rgba(255, 255, 255, 0.7);
    }
  `,

  leftBrand: css`
    display: flex;
    align-items: center;
    gap: ${token.paddingSM}px;
    margin-bottom: ${token.marginLG}px;
  `,

  leftBrandText: css`
    font-weight: 700;
    font-size: 18px;
    color: ${token.colorText} !important;
    margin: 0 !important;
  `,

  leftTagline: css`
    color: ${token.colorTextSecondary} !important;
    font-size: ${token.fontSizeSM}px !important;
    line-height: 1.6 !important;
    margin-top: ${token.marginLG}px !important;
    margin-bottom: 0 !important;
    max-width: 320px;
  `,

  form: css`
    width: 100%;
    max-width: 360px;

    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 1000px ${token.colorBgContainer} inset !important;
      -webkit-text-fill-color: ${token.colorText} !important;
      caret-color: ${token.colorText};
      transition: background-color 5000s ease-in-out 0s;
    }

    .ant-input-affix-wrapper:has(input:-webkit-autofill) {
      background-color: ${token.colorBgContainer} !important;
    }
  `,

  formHeader: css`
    margin-bottom: ${token.marginLG + 8}px;
  `,

  infoAlert: css`
    margin-bottom: ${token.marginLG}px;
  `,

  tenantResolvedIcon: css`
    color: ${token.colorSuccess};
  `,

  submitButton: css`
    width: 100%;
    height: 40px;
    border-radius: ${token.borderRadius}px;
    font-weight: 600;
    letter-spacing: 0.02em;
  `,

  footerText: css`
    display: block;
    margin-top: ${token.margin}px;
    text-align: center;
  `,
}));
