"use client"

import { Button } from "../ui/button"
import { toast } from "sonner"

export default function Toasts() {
  return (
    <>
      <Button onClick={() => toast("Info alert pmliuyt")}>Show info alert</Button>

      <Button onClick={() => toast.success("Success alert brfzefc")}>
        Show success alert
      </Button>

      <Button onClick={() => toast.error("Error alert bsgvsefe")}>
        Show error alert
      </Button>

      <Button onClick={() => toast.warning("Warning alert :oijhgfd")}>
        Show warning alert
      </Button>
    </>
  )
}
