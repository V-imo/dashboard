import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCognito } from "@/lib/cognito";

interface UserWithTokens {
  id: string;
  email?: string | null;
  name?: string | null;
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

interface JWTToken {
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
  sub?: string;
  [key: string]: unknown;
}

interface SessionWithTokens {
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "cognito",
      name: "Cognito",
      credentials: {
        username: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        session: { label: "Session", type: "text" },
        newPassword: { label: "New Password", type: "password" },
      },
      async authorize(credentials) {
        // Handle new password challenge - doesn't need original password
        if (
          credentials?.session &&
          credentials?.newPassword &&
          credentials?.username
        ) {
          try {
            const cognito = getCognito();
            const result = await cognito.completeNewPasswordChallenge({
              username: credentials.username,
              session: credentials.session,
              newPassword: credentials.newPassword,
            });

            return {
              id: result.user.sub || credentials.username,
              email: result.user.email,
              name: result.user.name,
              accessToken: result.token.accessToken,
              idToken: result.token.idToken,
              refreshToken: result.token.refreshToken,
            } as UserWithTokens;
          } catch (error: unknown) {
            console.error("Password change error:", error);
            // Extract error message from Cognito error
            if (error && typeof error === "object") {
              const cognitoError = error as {
                name?: string;
                message?: string;
                $metadata?: { httpStatusCode?: number };
              };

              // AWS SDK errors have name and message properties
              if (cognitoError.name === "InvalidPasswordException") {
                const errorMessage =
                  cognitoError.message || "Password does not conform to policy";
                throw new Error(JSON.stringify({ message: errorMessage }));
              }
            }
            return null;
          }
        }

        // Regular sign in - requires username and password
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const cognito = getCognito();

          // Regular sign in
          const result = await cognito.signIn({
            username: credentials.username,
            password: credentials.password,
          });

          // Handle new password required challenge
          if ("challengeName" in result) {
            throw new Error(
              JSON.stringify({
                challengeName: result.challengeName,
                session: result.session,
                username: result.username,
              })
            );
          }

          return {
            id: result.user.sub || credentials.username,
            email: result.user.email,
            name: result.user.name,
            accessToken: result.token.accessToken,
            idToken: result.token.idToken,
            refreshToken: result.token.refreshToken,
          } as UserWithTokens;
        } catch (error: unknown) {
          // Check if it's a challenge error
          if (
            error instanceof Error &&
            error.message?.includes("challengeName")
          ) {
            throw error; // Re-throw to handle in the login form
          }
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const userWithTokens = user as UserWithTokens;
        const jwtToken = token as JWTToken;
        jwtToken.accessToken = userWithTokens.accessToken;
        jwtToken.idToken = userWithTokens.idToken;
        jwtToken.refreshToken = userWithTokens.refreshToken;
        jwtToken.sub = userWithTokens.id;
      }
      return token;
    },
    async session({ session, token }) {
      const jwtToken = token as JWTToken;
      if (jwtToken && session.user) {
        const sessionWithTokens = session as unknown as SessionWithTokens;
        sessionWithTokens.accessToken = jwtToken.accessToken;
        sessionWithTokens.idToken = jwtToken.idToken;
        sessionWithTokens.refreshToken = jwtToken.refreshToken;
        if (jwtToken.sub) {
          sessionWithTokens.user.id = jwtToken.sub;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
