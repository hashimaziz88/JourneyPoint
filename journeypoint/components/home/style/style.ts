import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, css }) => ({
  content: css`
    width: 100%;
    max-width: 360px;
  `,

  buttonGroup: css`
    display: flex;
    flex-direction: column;
    gap: ${token.margin}px;
    margin-top: ${token.marginLG}px;
  `,

  primaryButton: css`
    height: 48px;
    border-radius: ${token.borderRadiusLG}px;
    font-weight: 600;
  `,

  secondaryButton: css`
    height: 48px;
    border-radius: ${token.borderRadiusLG}px;
    font-weight: 600;
  `,

  footerText: css`
    display: block;
    margin-top: ${token.marginLG}px;
    text-align: center;
  `,
}));
