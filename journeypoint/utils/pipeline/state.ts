import type { PipelineBoardDto } from "@/types/pipeline/pipeline";
import type { IPipelineStateContext } from "@/providers/pipelineProvider/context";

type PipelineStatePatch = Partial<IPipelineStateContext>;

export const buildPipelinePendingState = (): PipelineStatePatch => ({
    isPending: true,
    isError: false,
    isSuccess: false,
});

export const buildPipelineSuccessState = (
    board: PipelineBoardDto | null,
): PipelineStatePatch => ({
    isPending: false,
    isError: false,
    isSuccess: true,
    board,
});

export const buildPipelineErrorState = (): PipelineStatePatch => ({
    isPending: false,
    isError: true,
    isSuccess: false,
});
