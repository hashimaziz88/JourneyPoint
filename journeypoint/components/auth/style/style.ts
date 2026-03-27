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
    max-width: 920px;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: ${token.boxShadowSecondary};

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
    background: linear-gradient(
      135deg,
      ${token.colorPrimary},
      ${token.colorPrimaryBgHover}
    );
    padding: 48px;
  `,

  rightCol: css`
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${token.colorBgContainer};
    padding: 48px;
  `,

  leftContent: css`
    max-width: 420px;
    color: ${token.colorTextBase};

    h1 {
      color: ${token.colorTextBase} !important;
      margin-bottom: ${token.margin}px;
    }

    .ant-typography {
      color: rgba(255, 255, 255, 0.85);
    }
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
    margin-bottom: ${token.marginLG}px;
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
  `,

  footerText: css`
    display: block;
    margin-top: ${token.margin}px;
    text-align: center;
  `,
}));
