"use client";
import { useOrganization } from "@clerk/nextjs";
import { ProjectDialog } from "./_components/forms/projec-form-dialog";
import { PageHeader } from "./_components/header";

export default function Dashboard() {
  const { membership } = useOrganization();
  const isAdmin = membership?.role === "org:admin";
  return (

      <PageHeader
        title={`Welcome back, ${"User"}!`}
        subtitle="A quick overview of your projects today"
        action={isAdmin ? <ProjectDialog /> : null}
      />

  );
}
