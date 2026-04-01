import type { Dayjs } from "dayjs";
import type {
    CreateHireRequest,
    HireDetailDto,
    HireListItemDto,
    HireManagerOption,
    HirePlanOption,
} from "@/types/hire/hire";

export type HireListViewProps = Record<string, never>;

export type HireDetailViewProps = {
    hireId: string;
};

export type HireCardProps = {
    hire: HireListItemDto;
    onOpenDetail: (hireId: string) => void;
    onOpenJourney: (hireId: string) => void;
};

export type HireFormProps = {
    isOpen: boolean;
    isPending: boolean;
    managerOptions: HireManagerOption[];
    planOptions: HirePlanOption[];
    onCancel: () => void;
    onSubmit: (payload: CreateHireRequest) => Promise<void>;
};

export type HireFormValues = {
    onboardingPlanId: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    roleTitle?: string;
    department?: string;
    startDate: Dayjs;
    managerUserId?: number;
};

export type HireJourneySummaryProps = {
    hire: HireDetailDto;
    onOpenJourney: (hireId: string) => void;
    isJourneyActionPending: boolean;
};
