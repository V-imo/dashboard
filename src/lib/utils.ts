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

/**
 * Decode JWT token and extract Cognito groups and custom:currentAgency
 * @param idToken The Cognito ID token (JWT)
 * @returns Object containing groups and currentAgency
 */
export function decodeCognitoToken(idToken: string): {
  groups: string[];
  currentAgency?: string;
} {
  try {
    // JWT format: header.payload.signature
    const parts = idToken.split(".");
    if (parts.length !== 3) {
      return { groups: [] };
    }

    // Decode the payload (second part)
    const payload = parts[1];
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decoded = Buffer.from(paddedPayload, "base64").toString("utf-8");
    const claims = JSON.parse(decoded);

    // Extract Cognito groups (cognito:groups claim)
    const groups = claims["cognito:groups"];
    const groupsArray = Array.isArray(groups) ? groups : [];

    // Extract custom:currentAgency attribute
    const currentAgency = claims["custom:currentAgency"];

    return {
      groups: groupsArray,
      currentAgency: currentAgency || undefined,
    };
  } catch (error) {
    console.error("Error decoding Cognito token:", error);
    return { groups: [] };
  }
}
