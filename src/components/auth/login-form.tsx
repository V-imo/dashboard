"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function LoginForm() {
  const t = useTranslations("LoginForm");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [challengeData, setChallengeData] = useState<{
    session: string;
    username: string;
  } | null>(null);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return t("passwordTooShort");
    }
    if (!/[A-Z]/.test(password)) {
      return t("passwordMustHaveUppercase");
    }
    if (!/[a-z]/.test(password)) {
      return t("passwordMustHaveLowercase");
    }
    if (!/[0-9]/.test(password)) {
      return t("passwordMustHaveNumber");
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return t("passwordMustHaveSpecialChar");
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (challengeData) {
        // Handle new password challenge
        if (newPassword !== confirmNewPassword) {
          toast.error(t("passwordsDoNotMatch"));
          setLoading(false);
          return;
        }

        const passwordError = validatePassword(newPassword);
        if (passwordError) {
          toast.error(passwordError);
          setLoading(false);
          return;
        }

        // For challenge completion, we only need username, session, and newPassword
        const result = await signIn("cognito", {
          username: challengeData.username,
          password: "", // Not needed for challenge completion
          session: challengeData.session,
          newPassword: newPassword,
          redirect: false,
        });

        if (result?.error) {
          // Try to extract specific error message from Cognito
          let errorMessage = t("passwordChangeFailed");

          try {
            const errorData = JSON.parse(result.error);
            if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch {
            // If error is not JSON, use the raw error message
            errorMessage = result.error;
          }

          // Check for specific Cognito password policy errors and translate them
          const errorLower = errorMessage.toLowerCase();
          if (errorLower.includes("uppercase")) {
            toast.error(t("passwordMustHaveUppercase"));
          } else if (errorLower.includes("lowercase")) {
            toast.error(t("passwordMustHaveLowercase"));
          } else if (
            errorLower.includes("number") ||
            errorLower.includes("digit")
          ) {
            toast.error(t("passwordMustHaveNumber"));
          } else if (
            errorLower.includes("special") ||
            errorLower.includes("symbol")
          ) {
            toast.error(t("passwordMustHaveSpecialChar"));
          } else if (
            errorLower.includes("length") ||
            errorLower.includes("8")
          ) {
            toast.error(t("passwordTooShort"));
          } else {
            // Show the original error message if it's informative
            toast.error(errorMessage);
          }

          setLoading(false);
        } else if (result?.ok) {
          toast.success(t("passwordChangedSuccess"));
          router.push("/");
          router.refresh();
        }
      } else {
        // Regular sign in
        const result = await signIn("cognito", {
          username: email,
          password,
          redirect: false,
        });

        if (result?.error) {
          // Check if it's a challenge error
          try {
            const errorData = JSON.parse(result.error);
            if (errorData.challengeName === "NEW_PASSWORD_REQUIRED") {
              setChallengeData({
                session: errorData.session,
                username: errorData.username,
              });
              toast.info(t("newPasswordRequired"));
              setLoading(false);
              return;
            }
          } catch {
            // Not a challenge error, continue with regular error handling
          }

          toast.error(t("invalidCredentials"));
          setLoading(false);
        } else if (result?.ok) {
          toast.success(t("loginSuccess"));
          router.push("/");
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(t("loginFailed"));
      setLoading(false);
    }
  };

  return (
    <Card className="w-full border-0 shadow-none bg-transparent">
      <CardHeader className="space-y-4 px-0">
        <div className="space-y-1">
          <CardTitle className="text-3xl font-bold">{t("signIn")}</CardTitle>
          <CardDescription className="text-base">
            {challengeData ? t("setNewPassword") : t("enterCredentials")}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                value={challengeData?.username || email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!!challengeData || loading}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="bg-background/50 border-border/50 focus-visible:border-primary focus-visible:ring-primary/20"
              />
            </div>

            {!challengeData && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">{t("password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="bg-background/50 border-border/50 focus-visible:border-primary focus-visible:ring-primary/20"
                />
              </div>
            )}

            {challengeData && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium">{t("newPassword")}</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    required
                    autoComplete="new-password"
                    minLength={8}
                    placeholder="••••••••"
                    className="bg-background/50 border-border/50 focus-visible:border-primary focus-visible:ring-primary/20"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("passwordRequirements")}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword" className="text-sm font-medium">
                    {t("confirmNewPassword")}
                  </Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    disabled={loading}
                    required
                    autoComplete="new-password"
                    minLength={8}
                    placeholder="••••••••"
                    className="bg-background/50 border-border/50 focus-visible:border-primary focus-visible:ring-primary/20"
                  />
                </div>
              </>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? (challengeData ? t("changingPassword") : t("signingIn")) : (challengeData ? t("changePassword") : t("signIn"))}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
