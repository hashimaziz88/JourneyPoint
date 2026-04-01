import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, css }) => ({
  page: css`
    height: 100dvh;
    background:
      radial-gradient(
        circle at 15% 20%,
        rgba(245, 158, 11, 0.15),
        transparent 26%
      ),
      radial-gradient(
        circle at 85% 85%,
        rgba(37, 99, 235, 0.16),
        transparent 22%
      ),
      ${token.colorBgLayout};
    display: flex;
    justify-content: center;
    padding: 16px;
    overflow: hidden;

    @media (max-width: 768px) {
      height: auto;
      min-height: 100dvh;
      padding: 0;
      overflow: visible;
    }
  `,

  card: css`
    width: 100%;
    max-width: 1040px;
    margin: auto;
    border-radius: ${token.borderRadiusLG * 2}px;
    overflow: hidden;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
    border: 1px solid ${token.colorBorderSecondary};

    .ant-card-body {
      padding: 0;
    }

    @media (max-width: 768px) {
      max-width: 100%;
      margin: 0;
      border-radius: 0;
      box-shadow: none;
      border: none;
    }
  `,

  heroRow: css`
    height: 100%;

    @media (max-width: 768px) {
      height: auto;
    }
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
      rgba(245, 158, 11, 0.2) 46%,
      ${token.colorBgLayout} 100%
    );
    border-inline-end: 1px solid ${token.colorBorderSecondary};
    padding: 32px;

    @media (max-width: 768px) {
      padding: 24px 20px;
    }
  `,

  leftDecorator: css`
    position: absolute;
    inset: 0;
    background:
      radial-gradient(
        circle at 25% 75%,
        rgba(245, 158, 11, 0.18),
        transparent 55%
      ),
      radial-gradient(
        circle at 80% 10%,
        rgba(37, 99, 235, 0.14),
        transparent 48%
      );
    opacity: 0.9;
    pointer-events: none;
  `,

  rightCol: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
      180deg,
      ${token.colorBgContainer},
      ${token.colorBgElevated}
    );
    padding: 24px 36px;
    overflow-y: auto;

    @media (max-width: 768px) {
      padding: 20px 16px;
    }
  `,

  leftContent: css`
    max-width: 420px;
    color: ${token.colorTextBase};
    position: relative;
    z-index: 1;

    h1 {
      color: ${token.colorTextBase} !important;
      margin-bottom: ${token.marginXS}px;
      font-weight: 700 !important;
    }

    .ant-typography {
      color: ${token.colorTextSecondary};
    }
  `,

  leftBrand: css`
    display: flex;
    align-items: center;
    gap: ${token.paddingSM}px;
    margin-bottom: ${token.margin}px;
    text-decoration: none;
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
    margin-top: ${token.margin}px !important;
    margin-bottom: 0 !important;
    max-width: 320px;
  `,

  form: css`
    width: 100%;
    max-width: 380px;

    .ant-form-item {
      margin-bottom: 12px;
    }

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
    margin-bottom: ${token.margin}px;
  `,

  infoAlert: css`
    margin-bottom: ${token.margin}px;
  `,

  tenantResolvedIcon: css`
    color: ${token.colorSuccess};
  `,

  submitButton: css`
    width: 100%;
    height: 42px;
    border-radius: ${token.borderRadius}px;
    font-weight: 600;
    letter-spacing: 0.02em;
  `,

  footerText: css`
    display: block;
    margin-top: ${token.marginXS}px;
    text-align: center;
  `,
}));
