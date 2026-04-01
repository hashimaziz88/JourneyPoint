import { createContext } from "react";
export type {
    AcknowledgeAtRiskFlagRequest,
    HireIntelligenceDetailDto,
    ResolveAtRiskFlagRequest,
} from "@/types/engagement/engagement";
import type {
    AcknowledgeAtRiskFlagRequest,
    HireIntelligenceDetailDto,
    ResolveAtRiskFlagRequest,
} from "@/types/engagement/engagement";

export interface IEngagementStateContext {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    isMutationPending: boolean;
    selectedHireIntelligence?: HireIntelligenceDetailDto | null;
}

export interface IEngagementActionContext {
    getHireIntelligence: (hireId: string) => Promise<HireIntelligenceDetailDto | null>;
    acknowledgeAtRiskFlag: (
        hireId: string,
        payload: AcknowledgeAtRiskFlagRequest,
    ) => Promise<HireIntelligenceDetailDto | null>;
    resolveAtRiskFlag: (
        hireId: string,
        payload: ResolveAtRiskFlagRequest,
    ) => Promise<HireIntelligenceDetailDto | null>;
    resetHireIntelligence: () => void;
}

export const INITIAL_STATE: IEngagementStateContext = {
    isSuccess: false,
    isPending: false,
    isError: false,
    isMutationPending: false,
    selectedHireIntelligence: null,
};

export const EngagementStateContext = createContext<IEngagementStateContext>(INITIAL_STATE);
export const EngagementActionContext = createContext<IEngagementActionContext | undefined>(undefined);
