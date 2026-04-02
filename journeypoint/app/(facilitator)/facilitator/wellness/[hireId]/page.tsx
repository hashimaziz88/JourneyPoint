"use client";

import React, { use } from "react";
import WellnessOverviewView from "@/components/wellness/WellnessOverviewView";
import { WellnessProvider } from "@/providers/wellnessProvider";
import { buildFacilitatorWellnessCheckInRoute } from "@/routes/auth.routes";

interface FacilitatorHireWellnessPageProps {
    params: Promise<{ hireId: string }>;
}

const FacilitatorHireWellnessContent: React.FC<{ hireId: string }> = ({ hireId }) => (
    <WellnessProvider>
        <WellnessOverviewView
            hireId={hireId}
            checkInRoute={(checkInId) => buildFacilitatorWellnessCheckInRoute(hireId, checkInId)}
            readonly
        />
    </WellnessProvider>
);

const FacilitatorHireWellnessPage: React.FC<FacilitatorHireWellnessPageProps> = ({ params }) => {
    const { hireId } = use(params);
    return <FacilitatorHireWellnessContent hireId={hireId} />;
};

export default FacilitatorHireWellnessPage;
