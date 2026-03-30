import { createContext } from "react";
export type {
    IAcknowledgeAtRiskFlagRequest,
    IHireIntelligenceDetailDto,
    IResolveAtRiskFlagRequest,
} from "@/types/engagement";
import type {
    IAcknowledgeAtRiskFlagRequest,
    IHireIntelligenceDetailDto,
    IResolveAtRiskFlagRequest,
} from "@/types/engagement";

export interface IEngagementStateContext {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    isMutationPending: boolean;
    selectedHireIntelligence?: IHireIntelligenceDetailDto | null;
}

export interface IEngagementActionContext {
    getHireIntelligence: (hireId: string) => Promise<IHireIntelligenceDetailDto | null>;
    acknowledgeAtRiskFlag: (
        hireId: string,
        payload: IAcknowledgeAtRiskFlagRequest,
    ) => Promise<IHireIntelligenceDetailDto | null>;
    resolveAtRiskFlag: (
        hireId: string,
        payload: IResolveAtRiskFlagRequest,
    ) => Promise<IHireIntelligenceDetailDto | null>;
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
