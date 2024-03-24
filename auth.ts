import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from 'db/drizzle';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [Google],
});
