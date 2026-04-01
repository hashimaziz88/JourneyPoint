"use client";

import React, { useEffect, useEffectEvent } from "react";
import EnroleeJourneyDashboardView from "@/components/journey/EnroleeJourneyDashboardView";
import { APP_PERMISSIONS, APP_ROLE_NAMES } from "@/constants/auth/permissions";
import withAuth from "@/hoc/withAuth";
import {
    JourneyProvider,
    useJourneyActions,
    useJourneyState,
} from "@/providers/journeyProvider";

const EnroleeMyJourneyContent: React.FC = () => {
    const { getMyJourney, resetJourney } = useJourneyActions();
    const { isDetailPending, isError, myJourney } = useJourneyState();

    const loadDashboard = useEffectEvent(async (): Promise<void> => {
        await getMyJourney();
    });

    const clearDashboard = useEffectEvent((): void => {
        resetJourney();
    });

    useEffect(() => {
        void loadDashboard();

        return () => {
            clearDashboard();
        };
    }, []);

    return (
        <EnroleeJourneyDashboardView
            dashboard={myJourney}
            isError={isError}
            isPending={isDetailPending}
            onRefresh={async () => {
                await getMyJourney();
            }}
        />
    );
};

const EnroleeMyJourneyPage: React.FC = () => (
    <JourneyProvider>
        <EnroleeMyJourneyContent />
    </JourneyProvider>
);

export default withAuth(EnroleeMyJourneyPage, {
    requiredPermission: APP_PERMISSIONS.enrolee,
    allowedRoles: [APP_ROLE_NAMES.enrolee],
});
