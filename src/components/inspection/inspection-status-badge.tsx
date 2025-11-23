import { cn } from "@/lib/utils";

type InspectionStatus = "TO_DO" | "IN_PROGRESS" | "DONE" | "CANCELED";

interface InspectionStatusBadgeProps {
  status: InspectionStatus;
  className?: string;
}

const statusConfig: Record<
  InspectionStatus,
  { label: string; variant: string }
> = {
  TO_DO: {
    label: "To Do",
    variant:
      "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
  },
  IN_PROGRESS: {
    label: "In Progress",
    variant:
      "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  },
  DONE: {
    label: "Done",
    variant:
      "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  },
  CANCELED: {
    label: "Canceled",
    variant:
      "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  },
};

export default function InspectionStatusBadge({
  status,
  className,
}: InspectionStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        config.variant,
        className
      )}
    >
      {config.label}
    </span>
  );
}
