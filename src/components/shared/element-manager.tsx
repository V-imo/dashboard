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
import { Element } from "./rooms-manager";
import { useTranslations } from "next-intl";

type ElementTypeKey =
  | "furniture"
  | "structural"
  | "electrical"
  | "plumbing"
  | "ventilation"
  | "surface"
  | "other";

export type ElementType =
  | "FURNITURE"
  | "STRUCTURAL"
  | "ELECTRICAL"
  | "PLUMBING"
  | "VENTILATION"
  | "SURFACE"
  | "OTHER";

const elementTypeIcons: Record<
  ElementType,
  React.ComponentType<{ className?: string }>
> = {
  FURNITURE: Sofa,
  STRUCTURAL: Building2,
  ELECTRICAL: Zap,
  PLUMBING: Droplet,
  VENTILATION: Wind,
  SURFACE: Square,
  OTHER: Package,
};

interface ElementManagerProps {
  element: Element;
  elementIndex: number;
  roomIndex: number;
  onUpdate: (updates: Partial<Element>) => void;
  onRemove: () => void;
}

export default function ElementManager({
  element,
  elementIndex,
  roomIndex,
  onUpdate,
  onRemove,
}: ElementManagerProps) {
  const t = useTranslations("ElementManager");
  const [isEditingName, setIsEditingName] = useState(
    element.name === "" ? true : false
  );
  const showNameInput = !element.name || isEditingName;

  return (
    <Card className="bg-muted/50 border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TypeSelector
            type={element.type as ElementType}
            onUpdate={(type) => onUpdate({ type })}
          />
          <div className="flex justify-between w-full">
            <div className="ml-3 w-fit">
              {showNameInput ? (
                <Input
                  id={`room-${roomIndex}-element-${elementIndex}-name`}
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
                  placeholder={t("elementNamePlaceholder")}
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
          <Label
            htmlFor={`room-${roomIndex}-element-${elementIndex}-description`}
          >
            {t("description")}
          </Label>
          <Input
            id={`room-${roomIndex}-element-${elementIndex}-description`}
            type="text"
            value={element.description || ""}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder={t("elementDescriptionOptional")}
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
  const t = useTranslations("ElementManager");
  const tType = useTranslations("ElementTypeIcon");
  return (
    <Select
      value={type || "OTHER"}
      onValueChange={(value: ElementType) => onUpdate(value)}
    >
      <SelectTrigger className="w-fit min-w-[150px]">
        {type ? (
          <div className="flex items-center gap-2">
            {(() => {
              const Icon = elementTypeIcons[type as ElementType];
              return Icon ? <Icon className="w-4 h-4" /> : null;
            })()}
            <SelectValue>
              {tType(type.toLowerCase() as ElementTypeKey)}
            </SelectValue>
          </div>
        ) : (
          <SelectValue placeholder={t("selectType")} />
        )}
      </SelectTrigger>
      <SelectContent>
        {Object.entries(elementTypeIcons).map(([value, Icon]) => {
          return (
            <SelectItem key={value} value={value}>
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {tType(value.toLowerCase() as ElementTypeKey)}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
