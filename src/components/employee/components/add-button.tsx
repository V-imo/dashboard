"use client";

import { Button } from "@/components/ui/button";
import { Loader2, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { addEmployeeAction } from "../actions";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddEmployeeDialog() {
  const t = useTranslations("EmployeeAddButton");
  const [open, setOpen] = useState(false);

  const action = async (_prevState: unknown, formData: FormData) => {
    try {
      return await addEmployeeAction(formData);
    } catch (error) {
      console.error(error);
      return { error: "Failed to add employee" };
    }
  };

  const [state, formAction, isPending] = useActionState(action, null);

  useEffect(() => {
    if (state?.error) {
      toast.error(t("failedToAddEmployee"));
      setOpen(false);
    } else if (state?.success) {
      toast.success(t("employeeAddedSuccess"));
      setOpen(false);
    }
  }, [state, t]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="w-4 h-4 mr-2" />
          {t("addEmployee")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("addEmployee")}</DialogTitle>
          <DialogDescription>
            {t("addEmployeeDescription")}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">{t("firstName")}</Label>
            <Input id="firstName" type="text" name="firstName" placeholder={t("firstName")} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">{t("lastName")}</Label>
            <Input id="lastName" type="text" name="lastName" placeholder={t("lastName")} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input id="email" type="email" name="email" placeholder={t("email")} required />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isPending ? t("adding") : t("addEmployee")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
