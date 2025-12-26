import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export async function auth() {
  const session = await getServerSession(authOptions);
  if (!session || isSessionExpired(session)) {
    redirect("/login");
  }
  return session;
}

export function isSessionExpired(session: Session | null) {
  if (!session) {
    return false;
  }
  return new Date(session.expires) < new Date();
}
