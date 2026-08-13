"use client";
import { use } from "react";

import { Id } from "@/convex/_generated/dataModel";
import { useUserContext } from "@/hooks/use-user-context";
import { useTaskData } from "./_hooks/useTask";
import { HeaderSkeleton } from "../../dashboard/_components/skeleton/header";
import TaskHeader from "./_components/task-header";
import { useTaskComments } from "./_hooks/useTaskComments";
import { ChatContainer } from "./_components/Chat/chat-container";
import { TaskDetailsCard } from "./_components/task-details-card";
import { Card, CardContent } from "@/components/ui/card";
// import { ProjectCards } from './_components/projectCards';
// import ProjectTabs from './_components/ProjectTabs/project-tabs';

export default function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const userData = useUserContext()?.data;
  const userId = userData?.userId as Id<"users">;
  const orgId = userData?.orgId as Id<"organizations">;
  const { data, isLoading } = useTaskData({ orgId, taskId: id as Id<"tasks"> });
  const { data: comments, isLoading: isCommentLoading } = useTaskComments({
    orgId,
    taskId: id as Id<"tasks">,
  });

  return (
    <div className="app-page">
      {isLoading ? <HeaderSkeleton /> : <TaskHeader task={data} />}
      {isCommentLoading ? (
          <HeaderSkeleton />
        ) : (
            <div className="grid lg:grid-cols-3 gap-6 mt-4">
          <div className="lg:col-span-2">
            <Card className="p-4">
              <CardContent className="p-0">
                <ChatContainer comments={comments} taskId={id as Id<"tasks">} />
              </CardContent>
            </Card>
          </div>
            <TaskDetailsCard task={data} isLoading={isLoading} orgId={orgId} userId={userId} />
        </div>
      )}
      {/* <ProjectCards orgId={orgId} projectId={id as Id<"projects">} />
        <ProjectTabs isLead={isLead} userId={userId} orgId={orgId} projectId={id as Id<"projects">} /> */}
    </div>
  );
}
