export enum WellnessCheckInPeriod {
  Day1 = 1,
  Day2 = 2,
  Week1 = 3,
  Month1 = 4,
  Month2 = 5,
  Month3 = 6,
  Month4 = 7,
  Month5 = 8,
  Month6 = 9,
}

export enum WellnessCheckInStatus {
  Pending = 1,
  InProgress = 2,
  Completed = 3,
}

export type WellnessQuestionDto = {
  id: string;
  orderIndex: number;
  questionText: string;
  answerText: string | null;
  aiSuggestedAnswer: string | null;
  isAnswered: boolean;
};

export type WellnessCheckInSummaryDto = {
  id: string;
  period: WellnessCheckInPeriod;
  periodLabel: string;
  status: WellnessCheckInStatus;
  scheduledDate: string;
  submittedAt: string | null;
  answeredCount: number;
  totalCount: number;
};

export type WellnessCheckInDetailDto = {
  id: string;
  hireId: string;
  hireFullName: string;
  period: WellnessCheckInPeriod;
  periodLabel: string;
  status: WellnessCheckInStatus;
  scheduledDate: string;
  submittedAt: string | null;
  insightSummary: string | null;
  questions: WellnessQuestionDto[];
};

export type HireWellnessOverviewDto = {
  hireId: string;
  hireFullName: string;
  checkIns: WellnessCheckInSummaryDto[];
  completedCount: number;
  totalCount: number;
};

export type SaveWellnessAnswerRequest = {
  checkInId: string;
  questionId: string;
  answerText: string;
};

export type SubmitWellnessCheckInRequest = {
  checkInId: string;
};

export type GenerateWellnessAnswerSuggestionRequest = {
  checkInId: string;
  questionId: string;
};
