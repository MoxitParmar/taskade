"use client";

import React from "react";


import { Id } from "@/convex/_generated/dataModel";
import TaskToolbar from "./task-toolbar";
import { useSmartUrlSync } from "@/hooks/use-smart-url-sync";
import { useDeleteTask, useUpdateTask, useProjectMembersData, useProjectTasksData } from "../_hooks/useProject";
import { BulkDelete } from "@/app/(app)/settings/_components/bulk-delete";
import { ProjectTaskList } from "./projectTaskList";
import { TaskPriority, TaskStatus } from "@/convex/tasks/models";
import { Membership } from "@/convex/memberships/models";
type TaskQueryState = {
  priority: string;
  assignee: string;
  status: string;
  page: string;
};

const TaskTab = ({
  orgId,
  userId,
  projectId,
}: {
  orgId: Id<"organizations">;
  userId: Id<"users">;
  projectId: Id<"projects">;
}) => {
  const { execute: deleteTask } = useDeleteTask();
  const { execute: updateTask } = useUpdateTask();

  const [selectedTaskIds, setSelectedTaskIds] = React.useState<Id<"tasks">[]>([]);
  const onDeleteTask = async (id: string) => {
    if (!orgId) {
      throw new Error("Organization ID is required to delete Tasks.");
    }
    await deleteTask({ taskId: id as Id<"tasks">, orgId });
  };
  const { data} = useProjectMembersData({orgId, projectId});
    const memberOptions = React.useMemo(() => {
      return (
        (data ?? [])
          .filter((m: Membership) => m?.user?._id && m?.user?.name)
          .map((m: Membership) => ({
            value: m?.user?._id,
            label: m?.user?.name,
          }))
      );
    }, [data]);

    const defaultQueryState = React.useMemo<TaskQueryState>(
      () => ({
        priority: "",
        assignee: "",
        status: "",
        page: "1",
      }),
      [],
    );

    const [queryState, setQueryState] = React.useState<TaskQueryState>(defaultQueryState);

    const { setQueryValue, reset } = useSmartUrlSync<TaskQueryState>({
      state: queryState,
      setState: setQueryState,
      keys: ["priority", "assignee", "status", "page"],
      defaultState: defaultQueryState,
      debouncedKeys: ["priority", "assignee", "status"],
      debounceMs: 350,
      method: "replace",
      pageParam: "page",
      resetPageOn: ["priority", "assignee", "status"],
    });

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-2 md:flex-row md:items-start">
        <TaskToolbar
          status={queryState.status}
          onStatusChange={(value) => setQueryValue("status", value)}
          priority={queryState.priority}
          onPriorityChange={(value) => setQueryValue("priority", value)}
          assignee={queryState.assignee}
          onAssigneeChange={(value) => setQueryValue("assignee", value)}
          assigneeOptions={memberOptions}
          onReset={reset}
        />

      <BulkDelete
        selectedIds={selectedTaskIds}
        onDeleteItem={onDeleteTask}
        onClearSelection={() => setSelectedTaskIds([])}
        itemLabel="task"
      />
      </div>


      <ProjectTaskList
        orgId={orgId}
        assigneeId={queryState?.assignee as Id<"users">}
        priority={queryState?.priority as TaskPriority}
        status={queryState?.status as TaskStatus}
        projectId={projectId}
        selectedTaskIds={selectedTaskIds}
        onSelectionChange={(ids: Id<"tasks">[]) =>
          setSelectedTaskIds(
            ids.filter((id) => String(id) !== String(userId)),
          )
        }
        onStatusChange={(taskId, status) => {
          updateTask({ taskId, status, orgId, userId });
        }}
      />
    </div>
  );
};

export default TaskTab;
