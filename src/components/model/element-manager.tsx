"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  TrashIcon,
  PencilIcon,
  Sofa,
  Building2,
  Zap,
  Droplet,
  Wind,
  Square,
  Package,
} from "lucide-react";
import { Model } from "@/lib/dashboard-mgt-bff";

type ModelElement = Model["rooms"][number]["elements"][number];
type ElementType =
  | "FURNITURE"
  | "STRUCTURAL"
  | "ELECTRICAL"
  | "PLUMBING"
  | "VENTILATION"
  | "SURFACE"
  | "OTHER";

const elementTypeConfig: Record<
  ElementType,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  FURNITURE: { label: "Furniture", icon: Sofa },
  STRUCTURAL: { label: "Structural", icon: Building2 },
  ELECTRICAL: { label: "Electrical", icon: Zap },
  PLUMBING: { label: "Plumbing", icon: Droplet },
  VENTILATION: { label: "Ventilation", icon: Wind },
  SURFACE: { label: "Surface", icon: Square },
  OTHER: { label: "Other", icon: Package },
};

interface ModelElementManagerProps {
  element: ModelElement;
  onUpdate: (updates: Partial<ModelElement>) => void;
  onRemove: () => void;
}

export default function ModelElementManager({
  element,
  onUpdate,
  onRemove,
}: ModelElementManagerProps) {
  const [isEditingName, setIsEditingName] = useState(
    element.name === "" ? true : false
  );
  const showNameInput = !element.name || isEditingName;

  return (
    <Card className="bg-muted/50 border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TypeSelector
            type={(element.type || "OTHER") as ElementType}
            onUpdate={(type) => onUpdate({ type })}
          />
          <div className="flex justify-between w-full">
            <div className="ml-3 w-fit">
              {showNameInput ? (
                <Input
                  id={`element-${element.name}-name`}
                  type="text"
                  value={element.name}
                  onChange={(e) => onUpdate({ name: e.target.value })}
                  onBlur={() => {
                    if (element.name.trim()) {
                      setIsEditingName(false);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && element.name.trim()) {
                      setIsEditingName(false);
                    }
                  }}
                  placeholder="e.g., Window, Door, Floor"
                  className="text-base font-semibold"
                  autoFocus={isEditingName}
                />
              ) : (
                <CardTitle className="text-base w-fit min-w-0">
                  {element.name}
                </CardTitle>
              )}
            </div>
            <div className="flex items-center gap-2 justify-between">
              {!showNameInput && (
                <Button
                  onClick={() => setIsEditingName(true)}
                  variant="ghost"
                  size="sm"
                >
                  <PencilIcon className="w-4 h-4" />
                </Button>
              )}
              <Button onClick={onRemove} variant="destructive" size="sm">
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex flex-col gap-3">
        <div>
          <Label htmlFor={`element-${element.name}-description`}>
            Description
          </Label>
          <Input
            id={`element-${element.name}-description`}
            type="text"
            value={element.description || ""}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Element description (optional)"
          />
        </div>
      </CardContent>
    </Card>
  );
}

const TypeSelector = ({
  type,
  onUpdate,
}: {
  type: ElementType;
  onUpdate: (type: ElementType) => void;
}) => {
  return (
    <Select
      value={type || "OTHER"}
      onValueChange={(value: ElementType) => onUpdate(value)}
    >
      <SelectTrigger className="w-fit min-w-[150px]">
        {type ? (
          <div className="flex items-center gap-2">
            {(() => {
              const Icon = elementTypeConfig[type as ElementType]?.icon;
              return Icon ? <Icon className="w-4 h-4" /> : null;
            })()}
            <SelectValue>
              {elementTypeConfig[type as ElementType]?.label}
            </SelectValue>
          </div>
        ) : (
          <SelectValue placeholder="Select Type" />
        )}
      </SelectTrigger>
      <SelectContent>
        {Object.entries(elementTypeConfig).map(([value, config]) => {
          const Icon = config.icon;
          return (
            <SelectItem key={value} value={value}>
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {config.label}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

