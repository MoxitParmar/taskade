
import { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
    action?: ReactNode;
};

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
    return (
      <div className="flex flex-col gap-4 px-4 mt-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}

      </div>
  );
}

//usecase
// <PageHeader
//   title={`Welcome back, ${user?.firstName ?? "User"}!`}
//   subtitle="A quick overview of your projects today"
//   action={isAdmin ? <NewProjectDialog /> : null}
// />