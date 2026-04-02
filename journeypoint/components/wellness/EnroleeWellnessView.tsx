"use client";

import React, { useEffect, useEffectEvent } from "react";
import { Alert, Spin } from "antd";
import { useJourneyActions, useJourneyState } from "@/providers/journeyProvider";
import WellnessOverviewView from "@/components/wellness/WellnessOverviewView";
import { buildEnroleeWellnessCheckInRoute } from "@/routes/auth.routes";

/**
 * Renders the enrolee's own wellness check-in list by resolving their hire id
 * from their active journey session.
 */
const EnroleeWellnessView: React.FC = () => {
    const { getMyJourney } = useJourneyActions();
    const { myJourney, isDetailPending } = useJourneyState();

    const loadJourney = useEffectEvent(async (): Promise<void> => {
        if (!myJourney) {
            await getMyJourney();
        }
    });

    useEffect(() => {
        void loadJourney();
    }, []);

    if (isDetailPending) {
        return <Spin size="large" />;
    }

    if (!myJourney) {
        return (
            <Alert
                type="info"
                showIcon
                title="No active journey found."
                description="Wellness check-ins are available once your onboarding journey has been activated."
            />
        );
    }

    return (
        <WellnessOverviewView
            hireId={myJourney.hireId}
            checkInRoute={buildEnroleeWellnessCheckInRoute}
            readonly={false}
        />
    );
};

export default EnroleeWellnessView;
