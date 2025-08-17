import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyCredentials } from "lib/auth";
import { apiLimiter } from "lib/rate-limiter";
import { logger } from "lib/logger";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.username || !credentials?.password) {
            logger.error("Missing username or password");
            return null;
          }

          const reqHeaders = req?.headers || {};
          const ip = 
            reqHeaders["x-forwarded-for"] || 
            reqHeaders["x-real-ip"] || 
            "unknown-ip";

          // Securely extract client IP address
          let clientIp = req?.socket?.remoteAddress || "unknown-ip";
          // Optionally, validate IP format (IPv4/IPv6)
          if (typeof clientIp !== "string" || !clientIp.match(/^(\d{1,3}\.){3}\d{1,3}$|^[a-fA-F0-9:]+$/)) {
            clientIp = "unknown-ip";
          }
          
          if (apiLimiter.isRateLimited(clientIp)) {
            logger.warn(`Rate limited login attempt from IP: ${clientIp}`);
            throw new Error("Too many login attempts. Please try again later.");
          }
          
          logger.info(`Auth attempt for user: ${credentials.username}`, { 
            ip: clientIp.substring(0, 8) + "...",
          });
          
          const isValid = await verifyCredentials(
            credentials.username,
            credentials.password
          );
          
          if (!isValid) {
            logger.warn(`Authentication failed for user: ${credentials.username}`);
            return null;
          }
          
          logger.info(`Authentication successful for user: ${credentials.username}`);

          return {
            id: "1",
            name: "Admin",
            role: "admin",
          };
        } catch (error) {
          logger.error("Authentication error", { 
            error: error instanceof Error ? error.message : String(error) 
          });
          
          throw new Error(error instanceof Error ? error.message : "Authentication failed");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
};