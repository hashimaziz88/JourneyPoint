import React from "react";
import WellnessCheckInDetailView from "@/components/wellness/WellnessCheckInDetailView";
import { WellnessProvider } from "@/providers/wellnessProvider";
import { buildFacilitatorHireWellnessRoute } from "@/routes/auth.routes";

interface FacilitatorCheckInDetailPageProps {
    params: Promise<{ hireId: string; checkInId: string }>;
}

const FacilitatorCheckInDetailPage: React.FC<FacilitatorCheckInDetailPageProps> = async ({
    params,
}) => {
    const { hireId, checkInId } = await params;

    return (
        <WellnessProvider>
            <WellnessCheckInDetailView
                checkInId={checkInId}
                backRoute={buildFacilitatorHireWellnessRoute(hireId)}
                readonly
            />
        </WellnessProvider>
    );
};

export default FacilitatorCheckInDetailPage;
