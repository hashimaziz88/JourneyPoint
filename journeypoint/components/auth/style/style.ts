import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, css }) => ({
  page: css`
    min-height: 100vh;
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
    align-items: center;
    justify-content: center;
    padding: 28px;

    @media (max-width: 768px) {
      padding: 14px;
    }
  `,

  card: css`
    width: 100%;
    max-width: 1040px;
    border-radius: ${token.borderRadiusLG * 2}px;
    overflow: hidden;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
    border: 1px solid ${token.colorBorderSecondary};

    .ant-card-body {
      padding: 0;
    }
  `,

  heroRow: css`
    min-height: 620px;

    @media (max-width: 768px) {
      min-height: auto;
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
    padding: 56px;

    @media (max-width: 768px) {
      padding: 36px 24px;
      min-height: 320px;
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
    padding: 56px;

    @media (max-width: 768px) {
      padding: 30px 20px;
    }
  `,

  leftContent: css`
    max-width: 420px;
    color: ${token.colorTextBase};
    position: relative;
    z-index: 1;

    h1 {
      color: ${token.colorTextBase} !important;
      margin-bottom: ${token.margin}px;
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
    margin-bottom: ${token.marginLG}px;
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
    margin-top: ${token.marginLG}px !important;
    margin-bottom: 0 !important;
    max-width: 320px;
  `,

  form: css`
    width: 100%;
    max-width: 380px;
    padding: 8px;

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
    height: 42px;
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
