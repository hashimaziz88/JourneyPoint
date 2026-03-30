"use client";

import React, { useEffect, useEffectEvent } from "react";
import { useParams } from "next/navigation";
import JourneyTaskDetailView from "@/components/journey/JourneyTaskDetailView";
import { APP_PERMISSIONS, APP_ROLE_NAMES } from "@/constants/auth/permissions";
import withAuth from "@/hoc/withAuth";
import {
    JourneyProvider,
    useJourneyActions,
    useJourneyState,
} from "@/providers/journeyProvider";

const EnroleeJourneyTaskContent: React.FC = () => {
    const params = useParams<{ taskId: string }>();
    const taskId = Array.isArray(params.taskId) ? params.taskId[0] : params.taskId;
    const {
        acknowledgeMyTask,
        completeMyTask,
        getMyTask,
        resetJourney,
    } = useJourneyActions();
    const { isDetailPending, isMutationPending, selectedTask } = useJourneyState();

    const loadTask = useEffectEvent(async (): Promise<void> => {
        if (!taskId) {
            return;
        }

        await getMyTask(taskId);
    });

    const clearTask = useEffectEvent((): void => {
        resetJourney();
    });

    useEffect(() => {
        void loadTask();

        return () => {
            clearTask();
        };
    }, [taskId]);

    return (
        <JourneyTaskDetailView
            task={selectedTask}
            isPending={isDetailPending}
            isMutationPending={isMutationPending}
            onRefresh={async () => {
                if (taskId) {
                    await getMyTask(taskId);
                }
            }}
            onAcknowledge={async (task) => {
                const result = await acknowledgeMyTask({ journeyTaskId: task.journeyTaskId });
                return Boolean(result);
            }}
            onComplete={async (task) => {
                const result = await completeMyTask({ journeyTaskId: task.journeyTaskId });
                return Boolean(result);
            }}
        />
    );
};

const EnroleeJourneyTaskPage: React.FC = () => (
    <JourneyProvider>
        <EnroleeJourneyTaskContent />
    </JourneyProvider>
);

export default withAuth(EnroleeJourneyTaskPage, {
    requiredPermission: APP_PERMISSIONS.enrolee,
    allowedRoles: [APP_ROLE_NAMES.enrolee],
});
