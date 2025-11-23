import {
  Sofa,
  Building2,
  Zap,
  Droplet,
  Wind,
  Square,
  Package,
  LucideIcon,
} from "lucide-react";

export type ElementType =
  | "FURNITURE"
  | "STRUCTURAL"
  | "ELECTRICAL"
  | "PLUMBING"
  | "VENTILATION"
  | "SURFACE"
  | "OTHER";

export const elementTypeConfig: Record<
  ElementType,
  { label: string; icon: LucideIcon }
> = {
  FURNITURE: { label: "Furniture", icon: Sofa },
  STRUCTURAL: { label: "Structural", icon: Building2 },
  ELECTRICAL: { label: "Electrical", icon: Zap },
  PLUMBING: { label: "Plumbing", icon: Droplet },
  VENTILATION: { label: "Ventilation", icon: Wind },
  SURFACE: { label: "Surface", icon: Square },
  OTHER: { label: "Other", icon: Package },
};

export function getElementTypeConfig(type: string) {
  return elementTypeConfig[type as ElementType] || elementTypeConfig.OTHER;
}


