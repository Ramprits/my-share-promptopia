import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { MongoClient } from "mongodb";

export default NextAuth({
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        // Fetch user from MongoDB
        const client = new MongoClient(process.env.MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        await client.connect();
        const users = client.db().collection("users");
        const user = await users.findOne({ email: credentials.email });
        if (user && user.password === credentials.password) {
          // If password matches, return user object
          return user;
        } else {
          // If credentials are invalid, throw an error
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  database: process.env.MONGODB_URI,
});
