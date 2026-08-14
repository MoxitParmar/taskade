"use client"
import { PageHeader } from "@/app/(app)/dashboard/_components/header";


export default function ActivityHeader() {


  return (
    <>
        <PageHeader
          title="Activity"
          subtitle="View recent activity across your organization"
          back={true}
        />

    </>
  );
}