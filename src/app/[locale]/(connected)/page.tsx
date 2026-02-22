"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  MapPin,
  ClipboardCheck,
  Building2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useSession } from "next-auth/react";

const DAY_NAMES = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTH_NAMES = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function buildCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = (firstDay.getDay() + 6) % 7;
  const days: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(d);
  return days;
}

const STATS = [
  {
    title: "Propriétés",
    description: "Biens gérés",
    icon: Building2,
    count: 6,
  },
  {
    title: "À planifier",
    description: "Inspections en attente",
    count: 4,
    icon: ClipboardCheck,
  },
  {
    title: "En cours",
    description: "Inspections en cours",
    count: 1,
    icon: Clock,
  },
  {
    title: "Terminées",
    description: "Inspections terminée",
    count: 1,
    icon: TrendingUp,
  },
];

interface SelectedDay {
  date: Date;
  day: number;
}

export default function Home() {
  const { data: session } = useSession();
  const today = new Date();
  const calendarDays = buildCalendarDays(today.getFullYear(), today.getMonth());
  const [selectedDay, setSelectedDay] = useState<SelectedDay | null>(null);

  const handleDayClick = (day: number) => {
    const selectedDate = new Date(today.getFullYear(), today.getMonth(), day);
    setSelectedDay({ date: selectedDate, day });
  };

  const formattedSelectedDate = selectedDay
    ? selectedDay.date.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "";

  return (
    <div className="flex flex-col max-w-6xl w-full gap-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
          Bonjour{session?.user?.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="text-muted-foreground text-sm mt-1.5">
          {today.toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <Card key={stat.title} className="card-interactive">
            <CardHeader className="pb-2">
              <CardDescription>{stat.title}</CardDescription>
              <CardAction>
                <div className="p-2 rounded-lg bg-muted/30">
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              <span className="text-3xl font-bold tracking-tight">{stat.count}</span>
              <span className="text-xs text-muted-foreground">
                {stat.description}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-4 w-4 text-primary" />
              Calendrier des inspections
            </CardTitle>
            <CardDescription>
              {MONTH_NAMES[today.getMonth()]} {today.getFullYear()}
            </CardDescription>
            <CardAction>
              <Badge variant="secondary">Bientôt</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-7">
              {DAY_NAMES.map((d) => (
                <div
                  key={d}
                  className="text-center text-xs font-medium text-muted-foreground py-1.5"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => (
                <button
                  key={i}
                  onClick={() => day !== null && handleDayClick(day)}
                  disabled={day === null}
                  className={[
                    "aspect-square flex items-center justify-center rounded-lg text-sm select-none transition-colors duration-150",
                    day === null
                      ? ""
                      : day === today.getDate()
                      ? "bg-primary text-primary-foreground font-semibold ring-2 ring-primary/30 shadow-sm hover:bg-primary/90 cursor-pointer"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm cursor-pointer",
                  ].join(" ")}
                >
                  {day ?? ""}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Cliquez sur une journée pour voir les inspections.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-primary" />
              Prochaines inspections
            </CardTitle>
            <CardDescription>Dans les 7 prochains jours</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 animate-pulse"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ClipboardCheck className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-3 bg-border/80 rounded-full w-3/4" />
                  <div className="h-2.5 bg-border/60 rounded-full w-1/2" />
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground text-center mt-1">
              Vos prochaines inspections apparaîtront ici.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-4 w-4 text-primary" />
            Carte des propriétés
          </CardTitle>
          <CardDescription>
            Visualisez la localisation de vos biens
          </CardDescription>
          <CardAction>
            <Badge variant="secondary">Bientôt</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="w-full h-56 rounded-xl bg-muted/40 border-2 border-dashed border-border flex flex-col items-center justify-center gap-3">
            <div className="p-4 rounded-full bg-primary/10">
              <MapPin className="h-7 w-7 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Carte interactive
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                La carte de vos propriétés sera disponible prochainement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={selectedDay !== null} onOpenChange={(open) => !open && setSelectedDay(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Inspections du {formattedSelectedDate}
            </DialogTitle>
            <DialogDescription>
              Liste des inspections prévues pour cette journée
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <ClipboardCheck className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Aucune inspection</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Aucune inspection n'est prévue pour cette journée.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
