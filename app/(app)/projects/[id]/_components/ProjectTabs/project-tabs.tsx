"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, SquareKanban, UserPlus, Users } from "lucide-react";
import { useSmartUrlSync } from "@/hooks/use-smart-url-sync";
import { Id } from "@/convex/_generated/dataModel";
import TaskTab from "./ProjectTasksTab/task-tab";
import {
  useDeleteTask,
  useProjectMembersData,
  useProjectTasksData,
  useUpdateTask,
} from "../../_hooks/useProject";

import Kanban from "./KanbanTab/kanban";

import CalendarTab from "./CalendarTab/calendarTab";
import SettingsTab from "./ProjectSettingsTab/settingTab";

type TasksTabQueryState = {
  tab: "Tasks" | "Calendar" | "Kanban" | "Settings";
};

const TAB_VALUES: TasksTabQueryState["tab"][] = [
  "Tasks",
  "Calendar",
  "Kanban",
  "Settings",
];

export default function ProjectTabs({
  isLead,
  userId,
  orgId,
  projectId,
}: {
  isLead: boolean;
  userId: Id<"users">;
  orgId: Id<"organizations">;
  projectId: Id<"projects">;
}) {
  const defaultQueryState = React.useMemo<TasksTabQueryState>(
    () => ({ tab: "Tasks" }),
    [],
  );
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const [queryState, setQueryState] =
    React.useState<TasksTabQueryState>(defaultQueryState);

  const { setQueryValue } = useSmartUrlSync<TasksTabQueryState>({
    state: queryState,
    setState: setQueryState,
    keys: ["tab"],
    defaultState: defaultQueryState,
    method: "replace",
  });

  const currentTab = TAB_VALUES.includes(queryState.tab)
    ? queryState.tab
    : defaultQueryState.tab;

  const taskData = useProjectTasksData({
    orgId: String(orgId),
    projectId: String(projectId),
  });
  const membersData  = useProjectMembersData({orgId: String(orgId), projectId: String(projectId)});
  const { execute: deleteTask } = useDeleteTask();
  const { execute: updateTask } = useUpdateTask();
  return (
    <div>
      {isMounted && (
        <Tabs
          value={currentTab}
          onValueChange={(value) =>
            setQueryValue("tab", value as TasksTabQueryState["tab"])
          }
        >
          <TabsList variant="default" className="">
            <TabsTrigger value="Tasks" className="cursor-pointer">
              <Users className="size-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="Calendar" className="cursor-pointer">
              <UserPlus className="size-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="Kanban" className="cursor-pointer">
              <SquareKanban className="size-4" />
              Kanban
            </TabsTrigger>
            {isLead && (
              <TabsTrigger value="Settings" className="cursor-pointer">
                <Settings className="size-4" />
                Settings
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="Tasks">
            <div className="flex flex-col  justify-center rounded-xl border-border/60">
              <TaskTab
                orgId={orgId}
                userId={userId}
                projectId={projectId}
              />
            </div>
          </TabsContent>
          <TabsContent value="Calendar">
            <div className="flex flex-col  justify-center rounded-xl border-border/60">
              <CalendarTab
                tasks={taskData.data}
                isLoading={taskData?.isLoading}
              />
            </div>
          </TabsContent>
          <TabsContent value="Kanban">
            <div className="flex flex-col  justify-center rounded-xl border-border/60">
              <Kanban
                onDeleteTask={
                  async (taskId) => {
                    await deleteTask({ taskId: taskId as Id<"tasks">, orgId });
                  }
                }
                onStatusChange={async (taskId, status) => {
                  await updateTask({ taskId, status, orgId, userId });
                }}
                tasks={taskData.data}
              />
            </div>
          </TabsContent>
          <TabsContent value="Settings">
            <div className="flex flex-col  justify-center rounded-xl border-border/60">
              <SettingsTab orgId={orgId} userId={userId} projectId={projectId} membersData={membersData} />
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
