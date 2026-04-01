import { createContext } from "react";
import type {
    PipelineBoardDto,
    PipelineBoardQueryState,
} from "@/types/pipeline/pipeline";

export interface IPipelineStateContext {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    board?: PipelineBoardDto | null;
    filters: PipelineBoardQueryState;
}

export interface IPipelineActionContext {
    getBoard: (request?: PipelineBoardQueryState) => Promise<PipelineBoardDto | null>;
    setFilters: (filters: PipelineBoardQueryState) => void;
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
    PipelineBoardDto,
    PipelineBoardQueryState,
} from "@/types/pipeline/pipeline";

export const PipelineStateContext = createContext<IPipelineStateContext>(INITIAL_STATE);
export const PipelineActionContext = createContext<IPipelineActionContext | undefined>(undefined);
