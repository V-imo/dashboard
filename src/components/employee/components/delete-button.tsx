"use client";

import { Button } from "@/components/ui/button";
import { Loader2, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { deleteEmployeeAction } from "../actions";
import { useSession } from "next-auth/react";

export default function DeleteButton(props: {
  username: string;
  email?: string;
}) {
  const t = useTranslations("EmployeeDeleteButton");
  const { data: session } = useSession();

  const del = async () => {
    try {
      await deleteEmployeeAction(props.username);
      toast.success(t("employeeDeletedSuccess"));
    } catch (error) {
      console.error(error);
      return { error: t("failedToDeleteEmployee") };
    }
  };

  const [state, formAction, isPending] = useActionState(del, null);

  useEffect(() => {
    if (state?.error) {
      toast.error(t("failedToDeleteEmployee"));
    }
  }, [state, t]);

  return (
    <form action={formAction}>
      <Button
        variant="destructive"
        size="sm"
        type="submit"
        disabled={session?.user?.email === props.email}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <TrashIcon className="w-4 h-4" />
        )}
        {t("deleteEmployee")}
      </Button>
    </form>
  );
}
