import React from "react";
import FacilitatorWellnessListView from "@/components/wellness/FacilitatorWellnessListView";
import { WellnessProvider } from "@/providers/wellnessProvider";
import { HireProvider } from "@/providers/hireProvider";

const FacilitatorWellnessPage: React.FC = () => (
    <HireProvider>
        <WellnessProvider>
            <FacilitatorWellnessListView />
        </WellnessProvider>
    </HireProvider>
);

export default FacilitatorWellnessPage;
