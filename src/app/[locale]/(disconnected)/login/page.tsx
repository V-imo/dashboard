"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";
import LoginForm from "@/components/auth/login-form";
import Image from "next/image";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-flex items-center gap-2">
            <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex lg:w-1/2 bg-background relative overflow-hidden items-center justify-center border-r border-border/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex flex-col items-center gap-8 px-12 text-center max-w-sm">
          <div className="flex items-center justify-center h-24 w-24 rounded-2xl bg-card shadow-lg border border-border/30">
            <Image
              src="/logo.png"
              alt="V'imo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-foreground tracking-tight">
              V&apos;imo
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Gérer vos inspections immobilères de manière optimisées et collaboratives, pour une gestion efficace de vos biens.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-muted flex items-center justify-center mt-1">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Gestion complète des propriétés</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-muted flex items-center justify-center mt-1">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Inspections et rapports détaillés</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 bg-background relative">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary/4 rounded-full blur-3xl -translate-y-1/2" />

        <div className="lg:hidden flex flex-col items-center gap-3 mb-8">
          <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-card shadow-md border border-border/30">
            <Image
              src="/logo.png"
              alt="V'imo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            V&apos;imo
          </h2>
        </div>

        <div className="relative z-10 w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
