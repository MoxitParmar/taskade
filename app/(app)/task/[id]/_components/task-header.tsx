"use client"

import { PageHeader } from "@/components/PageHeader";
import { Task } from "@/convex/tasks/models";

export default function TaskHeader({ task }: { task: Task }) {

  return (
    <>
        <PageHeader
          title={`${task?.name}`}
          subtitle={task?.description ?? "No description provided"}
          back={true}
          badge={task?.priority }
        />

    </>
  );
}