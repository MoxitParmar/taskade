"use client"

import { PageHeader } from "@/components/PageHeader";



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