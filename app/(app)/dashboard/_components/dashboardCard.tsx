import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardItem {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  iconColor?: string;
  bgColor?: string;
}

export function DashboardCard({ data }: { data: DashboardCardItem[] }) {
  return (
    <>
      {data.map((item) => (
        <Card
          key={item.title}
          className="gap-3 transition-colors duration-200 hover:border-accent-foreground/40"
        >
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
            <CardAction>
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-lg",
                  item.bgColor,
                )}
              >
                <item.icon
                  className={cn("size-4", item.iconColor)}
                  strokeWidth={2}
                />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold tracking-tight">
              {item.value}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {item.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
