"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { TrashIcon } from "lucide-react";
import { Inspection, RoomElement } from "@/lib/dashboard-mgt-bff";
import { getElementTypeConfig } from "../shared/element-type-icon";
import ElementStateBadge from "../shared/element-state-badge";
import { cn } from "@/lib/utils";

type InspectionElement = NonNullable<Inspection["elements"]>[number];

interface InspectionElementEditorProps {
  element: InspectionElement;
  propertyRoomElement?: RoomElement | null;
  elementKey: string;
  onUpdate: (updates: Partial<InspectionElement>) => void;
  onRemove?: () => void;
  isAdditional?: boolean;
}

export default function InspectionElementEditor({
  element,
  propertyRoomElement,
  elementKey,
  onUpdate,
  onRemove,
  isAdditional = false,
}: InspectionElementEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStateSelect = (
    state: "NEW" | "GOOD" | "BAD" | "BROKEN" | "MISSING"
  ) => {
    onUpdate({ state });
    setIsExpanded(false);
  };

  const typeConfig = propertyRoomElement
    ? getElementTypeConfig(propertyRoomElement.type)
    : null;
  const Icon = typeConfig?.icon;

  return (
    <Card className={cn("border", isAdditional && "border-2 border-dashed")}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
            <CardTitle className="text-base">{element.name}</CardTitle>
          </div>
          {isAdditional && onRemove && (
            <Button onClick={onRemove} variant="destructive" size="sm">
              <TrashIcon className="w-4 h-4 mr-2" />
              Remove
            </Button>
          )}
        </div>
        {propertyRoomElement?.description && (
          <CardDescription className="text-xs">
            {propertyRoomElement.description}
          </CardDescription>
        )}
        {isAdditional && (
          <CardDescription>Element added during inspection</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <Label htmlFor={`element-${elementKey}-description`}>
            Description
          </Label>
          <Input
            id={`element-${elementKey}-description`}
            type="text"
            value={element.description || ""}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Inspection-specific description (optional)"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>State</Label>
          <div className="flex flex-wrap gap-2">
            {isExpanded ? (
              (["NEW", "GOOD", "BAD", "BROKEN", "MISSING"] as const).map(
                (state) => (
                  <button
                    key={state}
                    type="button"
                    onClick={() => handleStateSelect(state)}
                    className="cursor-pointer transition-all"
                  >
                    <ElementStateBadge state={state} />
                  </button>
                )
              )
            ) : (
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="cursor-pointer"
              >
                <ElementStateBadge state={element.state || "NEW"} />
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
