import type { Dayjs } from "dayjs";
import type {
    ICreateHireRequest,
    IHireDetailDto,
    IHireListItemDto,
    IHireManagerOption,
    IHirePlanOption,
} from "@/types/hire";

export type IHireListViewProps = Record<string, never>;

export interface IHireDetailViewProps {
    hireId: string;
}

export interface IHireCardProps {
    hire: IHireListItemDto;
    onOpenDetail: (hireId: string) => void;
    onOpenJourney: (hireId: string) => void;
}

export interface IHireFormProps {
    isOpen: boolean;
    isPending: boolean;
    managerOptions: IHireManagerOption[];
    planOptions: IHirePlanOption[];
    onCancel: () => void;
    onSubmit: (payload: ICreateHireRequest) => Promise<void>;
}

export interface IHireFormValues {
    onboardingPlanId: string;
    fullName: string;
    emailAddress: string;
    roleTitle?: string;
    department?: string;
    startDate: Dayjs;
    managerUserId?: number;
}

export interface IHireJourneySummaryProps {
    hire: IHireDetailDto;
    onOpenJourney: (hireId: string) => void;
    isJourneyActionPending: boolean;
}
