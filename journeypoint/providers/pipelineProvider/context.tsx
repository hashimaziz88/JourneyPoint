import { createContext } from "react";
import type {
    IPipelineBoardDto,
    IPipelineBoardQueryState,
} from "@/types/pipeline";

export interface IPipelineStateContext {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    board?: IPipelineBoardDto | null;
    filters: IPipelineBoardQueryState;
}

export interface IPipelineActionContext {
    getBoard: (request?: IPipelineBoardQueryState) => Promise<IPipelineBoardDto | null>;
    setFilters: (filters: IPipelineBoardQueryState) => void;
    resetFilters: () => void;
}

export const INITIAL_STATE: IPipelineStateContext = {
    isSuccess: false,
    isPending: false,
    isError: false,
    board: null,
    filters: {
        keyword: "",
        classification: undefined,
    },
};

export type {
    IPipelineBoardDto,
    IPipelineBoardQueryState,
} from "@/types/pipeline";

export const PipelineStateContext = createContext<IPipelineStateContext>(INITIAL_STATE);
export const PipelineActionContext = createContext<IPipelineActionContext | undefined>(undefined);
