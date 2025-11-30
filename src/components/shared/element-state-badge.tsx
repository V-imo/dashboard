import { cn } from "@/lib/utils";

type ElementState = "GOOD" | "BAD" | "NEW" | "BROKEN" | "MISSING";

interface ElementStateBadgeProps {
  state: ElementState;
  className?: string;
}

const stateConfig: Record<ElementState, { label: string; variant: string }> = {
  GOOD: {
    label: "Good",
    variant:
      "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  },
  BAD: {
    label: "Bad",
    variant:
      "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  },
  NEW: {
    label: "New",
    variant:
      "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  },
  BROKEN: {
    label: "Broken",
    variant:
      "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
  },
  MISSING: {
    label: "Missing",
    variant:
      "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800",
  },
};

export default function ElementStateBadge({
  state,
  className,
}: ElementStateBadgeProps) {
  const config = stateConfig[state];

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
