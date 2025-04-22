import NextAuth, { SessionStrategy } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyCredentials, verify2FACode } from 'lib/auth';
import { loginLimiter } from 'lib/rate-limiter';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        code: { label: "2FA Code", type: "text" }
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }
        
        const ip = req?.headers?.['x-real-ip'] || req?.headers?.['x-forwarded-for'] || 'unknown';
        if (loginLimiter.isRateLimited(ip)) {
          throw new Error('Too many login attempts. Please try again later.');
        }

        const isValidCredentials = await verifyCredentials(
          credentials.username,
          credentials.password
        );
        
        if (!isValidCredentials) {
          return null;
        }
        
        if (process.env.ADMIN_2FA_SECRET) {
          if (!credentials.code || !verify2FACode(credentials.code)) {
            return null;
          }
        }
        
        return {
          id: '1',
          name: 'Admin',
          email: 'admin@example.com',
          role: 'admin'
        };
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
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
    strategy: 'jwt' as SessionStrategy,
    maxAge: 60 * 60,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60,
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };