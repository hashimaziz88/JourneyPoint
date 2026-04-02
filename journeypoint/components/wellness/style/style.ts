import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => ({
  pageRoot: css`
    width: 100%;
  `,

  hireBanner: css`
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    align-items: center;
    padding: 16px;
    border-radius: ${token.borderRadius}px;
    background: ${token.colorFillQuaternary};
  `,

  hireBannerName: css`
    margin-bottom: 0 !important;
  `,

  statsRow: css`
    display: flex;
    gap: 24px;
  `,

  checkInGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 12px;
  `,

  cardHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  `,

  smallText: css`
    font-size: 12px;
  `,

  detailHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,

  backLink: css`
    padding: 0;
  `,

  insightBody: css`
    margin-top: 8px;
  `,

  questionRow: css`
    display: flex;
    gap: 8px;
    align-items: flex-start;
  `,

  answerActions: css`
    display: flex;
    gap: 8px;
  `,

  noBottomMargin: css`
    margin-bottom: 0 !important;
  `,

  tinyBottomMargin: css`
    margin-bottom: 2px !important;
  `,

  hireSubtext: css`
    font-size: 12px;
  `,
}));
