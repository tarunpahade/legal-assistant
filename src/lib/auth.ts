/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { cookies } from "next/headers";

import CredentialsProvider from "next-auth/providers/credentials";
import Users from "@/dbconfig/dbconfig";

export const authOptions: NextAuthOptions = {
  secret: process.env.TOKEN_SECRET!,
  providers: [
    CredentialsProvider({
      name: "Sign In",
      credentials: {
        name: {
          label: "Name",
          type: "text",
          placeholder: "PAHADE TARUN NITIN",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        if (!credentials || !credentials.name || !credentials.password) {
          return null;
        }

        const name = credentials?.name as string;
        const password = credentials?.password as string;

        console.log(name, password);
        console.log(credentials);

        const token = cookies().get("next-auth.session-token");
        if (!token) {
          cookies().set("next-auth.session-token", password);
        }

        const user: any = await Users.findOne({ name });
        console.log(user);
        const session = {
          userType: user.userType,
          name: user.name,
        };

        cookies().set("user", JSON.stringify(session));

        if (!user) {
          console.log("user Not Found");

          return null;
        }


        return {
          ...session,
        } as any;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
};