import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

async function verifyCredentials(username: string, password: string): Promise<[boolean, string]> {
  const validUsername = process.env.ADMIN_USERNAME;
  const storedPassword = process.env.ADMIN_PASSWORD;
  const hashedPassword = process.env.ADMIN_PASSWORD_HASH;
  
  if (!validUsername) {
    console.error("ADMIN_USERNAME environment variable is not set");
    return [false, "Server configuration error: missing username"];
  }
  
  if (!storedPassword && !hashedPassword) {
    console.error("Neither ADMIN_PASSWORD nor ADMIN_PASSWORD_HASH environment variable is set");
    return [false, "Server configuration error: missing password"];
  }
  
  if (username !== validUsername) {
    return [false, "Invalid username"];
  }
  
  if (hashedPassword) {
    try {
      const isValid = await bcrypt.compare(password, hashedPassword);
      return [isValid, isValid ? "Success" : "Invalid password"];
    } catch (error) {
      console.error("Error comparing password:", error);
      return [false, "Error verifying password"];
    }
  } else {
    return [password === storedPassword, password === storedPassword ? "Success" : "Invalid password"];
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.username || !credentials?.password) {
            console.error("Missing username or password");
            return null;
          }
          
          console.log(`Auth attempt for user: ${credentials.username}`);
          console.log(`Running in environment: ${process.env.NODE_ENV}`);
          console.log(`Auth URL: ${process.env.NEXTAUTH_URL}`);
          
          const [isValid, reason] = await verifyCredentials(
            credentials.username,
            credentials.password
          );
          
          console.log(`Auth result: ${isValid ? "Success" : "Failed"}, Reason: ${reason}`);
          
          if (!isValid) {
            console.error("Authentication failed:", reason);
            return null;
          }
          
          return {
            id: '1',
            name: 'Admin',
            email: 'ayushamikhaylov@gmail.com.com',
            role: 'admin'
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
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
    strategy: 'jwt',
    maxAge: 60 * 60,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    }
  },
};