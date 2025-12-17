"use client";

import { Button } from "@/components/ui/button";
import { Loader2, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { addEmployeeAction } from "../actions";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
        <Button variant="default" size="sm">
          <PlusIcon className="w-4 h-4" />
          {t("addEmployee")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form action={formAction}>
          <div className="flex flex-col gap-4">
            <Input type="text" name="firstName" placeholder={t("firstName")} />
            <Input type="text" name="lastName" placeholder={t("lastName")} />
            <Input type="email" name="email" placeholder={t("email")} />
            <Button variant="default" size="sm" type="submit" >
              {isPending ? t("adding") : t("addEmployee")}
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
