import { createContext } from "react";
export type {
    HireWellnessOverviewDto,
    WellnessCheckInDetailDto,
    WellnessCheckInSummaryDto,
    WellnessQuestionDto,
    SaveWellnessAnswerRequest,
    SubmitWellnessCheckInRequest,
    GenerateWellnessAnswerSuggestionRequest,
} from "@/types/wellness/wellness";
import type {
    HireWellnessOverviewDto,
    WellnessCheckInDetailDto,
    WellnessQuestionDto,
    SaveWellnessAnswerRequest,
    SubmitWellnessCheckInRequest,
    GenerateWellnessAnswerSuggestionRequest,
} from "@/types/wellness/wellness";

export interface IWellnessStateContext {
    isOverviewPending: boolean;
    isDetailPending: boolean;
    isMutationPending: boolean;
    overview: HireWellnessOverviewDto | null;
    checkInDetail: WellnessCheckInDetailDto | null;
}

export interface IWellnessActionContext {
    getHireWellnessOverview: (hireId: string) => Promise<HireWellnessOverviewDto | null>;
    getCheckInDetail: (checkInId: string) => Promise<WellnessCheckInDetailDto | null>;
    saveAnswer: (request: SaveWellnessAnswerRequest) => Promise<WellnessQuestionDto | null>;
    generateAnswerSuggestion: (request: GenerateWellnessAnswerSuggestionRequest) => Promise<WellnessQuestionDto | null>;
    submitCheckIn: (request: SubmitWellnessCheckInRequest) => Promise<WellnessCheckInDetailDto | null>;
}

export const INITIAL_STATE: IWellnessStateContext = {
    isOverviewPending: false,
    isDetailPending: false,
    isMutationPending: false,
    overview: null,
    checkInDetail: null,
};

export const WellnessStateContext = createContext<IWellnessStateContext>(INITIAL_STATE);
export const WellnessActionContext = createContext<IWellnessActionContext | undefined>(undefined);
