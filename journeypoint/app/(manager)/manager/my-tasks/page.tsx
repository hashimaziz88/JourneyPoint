"use client";

import React, { useEffect, useEffectEvent } from "react";
import ManagerTaskWorkspaceView from "@/components/journey/ManagerTaskWorkspaceView";
import { APP_PERMISSIONS, APP_ROLE_NAMES } from "@/constants/auth/permissions";
import withAuth from "@/hoc/withAuth";
import {
    JourneyProvider,
    useJourneyActions,
    useJourneyState,
} from "@/providers/journeyProvider";

const ManagerMyTasksContent: React.FC = () => {
    const { completeManagerTask, getManagerTasks, resetJourney } = useJourneyActions();
    const { isDetailPending, isError, isMutationPending, managerWorkspace } = useJourneyState();

    const loadWorkspace = useEffectEvent(async (): Promise<void> => {
        await getManagerTasks();
    });

    const clearWorkspace = useEffectEvent((): void => {
        resetJourney();
    });

    useEffect(() => {
        void loadWorkspace();

        return () => {
            clearWorkspace();
        };
    }, []);

    return (
        <ManagerTaskWorkspaceView
            workspace={managerWorkspace}
            isError={isError}
            isPending={isDetailPending}
            isMutationPending={isMutationPending}
            onRefresh={async () => {
                await getManagerTasks();
            }}
            onComplete={async (journeyTaskId) => {
                const result = await completeManagerTask({ journeyTaskId });
                return Boolean(result);
            }}
        />
    );
};

const ManagerMyTasksPage: React.FC = () => (
    <JourneyProvider>
        <ManagerMyTasksContent />
    </JourneyProvider>
);

export default withAuth(ManagerMyTasksPage, {
    requiredPermission: APP_PERMISSIONS.manager,
    allowedRoles: [APP_ROLE_NAMES.manager],
});
