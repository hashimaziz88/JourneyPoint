import { handleActions } from "redux-actions";
import { INITIAL_STATE, IOnboardingPlanStateContext } from "./context";
import { OnboardingPlanActionEnums } from "./actions";

export const OnboardingPlanReducer = handleActions<IOnboardingPlanStateContext, Partial<IOnboardingPlanStateContext>>(
    {
        [OnboardingPlanActionEnums.getPlansPending]: (state, action) => ({ ...state, ...action.payload }),
        [OnboardingPlanActionEnums.getPlansSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [OnboardingPlanActionEnums.getPlansError]: (state, action) => ({ ...state, ...action.payload }),

        [OnboardingPlanActionEnums.getPlanDetailPending]: (state, action) => ({ ...state, ...action.payload }),
        [OnboardingPlanActionEnums.getPlanDetailSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [OnboardingPlanActionEnums.getPlanDetailError]: (state, action) => ({ ...state, ...action.payload }),

        [OnboardingPlanActionEnums.mutationPending]: (state, action) => ({ ...state, ...action.payload }),
        [OnboardingPlanActionEnums.mutationSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [OnboardingPlanActionEnums.mutationError]: (state, action) => ({ ...state, ...action.payload }),

        [OnboardingPlanActionEnums.setDraft]: (state, action) => ({ ...state, ...action.payload }),
        [OnboardingPlanActionEnums.resetDraft]: (state, action) => ({ ...state, ...action.payload }),
    },
    INITIAL_STATE,
);
