import { connectDB } from "@/libs/mongodb";
import User from "@/models/User";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { Profile as NextAuthProfile } from "next-auth";
import type { NextAuthOptions } from "next-auth";

interface ExtendedProfile extends NextAuthProfile {
  picture?: string;
}
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials.password) {
            throw new Error("Email and Password are required.");
          }

          await connectDB();

          const user = await User.findOne({ email: credentials.email }).select(
            "+password"
          );

          if (!user) {
            throw new Error("Invalid email or password.");
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            throw new Error("Invalid email or password.");
          }
          
          return user;
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: any;
      account: any;
      profile?: ExtendedProfile;
    }) {
      try {
        await connectDB();
        if (account?.provider === "google") {
          let existingUser = await User.findOne({ email: profile?.email });

          if (!existingUser) {
            existingUser = new User({
              email: profile?.email,
              name: profile?.name,
              image: profile?.picture,
            });

            await existingUser.save();
          }

          user.id = existingUser._id;
        }

        return true;
      } catch (error) {
        console.error("Error signing in user:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        image: token.image,
        email: token.email,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
