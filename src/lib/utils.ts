import { clsx, type ClassValue } from "clsx";
import { Session } from "next-auth";
import { unauthorized } from "next/navigation";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getHeaders(session: Session | null) {
  if (!session?.idToken) {
    unauthorized();
  }
  return { Authorization: session.idToken };
}

export function getClientHeaders(session: Session | null) {
  if (!session?.idToken) {
    throw new Error("No session found");
  }
  return { Authorization: session.idToken };
}
