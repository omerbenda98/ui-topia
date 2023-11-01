import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import { Document } from "mongoose";

import User from "@models/user";
import { connectToDB } from "@utils/database";

// interface UserDocument extends NextAuthUser, Document {
//   // Extend with your User model fields if any
// }

const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }: any) {
      // store the user id from MongoDB to session

      const sessionUser = await User.findOne({ email: session.user.email });

      if (sessionUser) {
        session.user.id = sessionUser._id.toString();
      }
      if (!sessionUser) {
        console.log("error");
      }

      return session;
    },
    async signIn({ profile }: any) {
      try {
        await connectToDB();

        // check if user already exists
        const userExists = await User.findOne({ email: profile.email });

        // if not, create a new document and save user in MongoDB
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(/\s/g, "").toLowerCase(),
            image: profile.picture,
          });
        }

        return true;
      } catch (error: any) {
        console.log("Error checking if user exists: ", error.message);
        return false;
      }
    },
  },
};

const handler = NextAuth(options);

export default handler;
