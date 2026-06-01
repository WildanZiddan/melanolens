// import { handlers } from '@/auth'
// export const { GET, POST } = handlers

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // 🔥 Nembak ke Backend FastAPI lu yang lagi jalan di port 8000
          const res = await fetch("http://127.0.0.1:8000/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
            headers: { "Content-Type": "application/json" },
          });

          const data = await res.json();

          // Jika login di FastAPI sukses (return status success)
          if (res.ok && data.status === "success") {
            return {
              id: data.user.email, // NextAuth wajib butuh field id berupa string
              name: data.user.name,
              email: data.user.email,
              token: data.token, // Simpan JWT token dari FastAPI
              authority: data.user.authority, // ["user"] atau ["admin"]
            };
          }
          
          // Jika gagal (password salah / user gak terdaftar)
          return null;
        } catch (error) {
          console.error("Gagal koneksi ke server FastAPI, Dan:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    // 🔑 Amankan data token & authority dari FastAPI ke dalam token NextAuth
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.token;
        token.authority = user.authority;
      }
      return token;
    },
    // 🌍 Lempar data authority ke Frontend biar bisa dibaca Session / Middleware lu
    async session({ session, token }: any) {
      if (session.user) {
        session.user.accessToken = token.accessToken;
        session.user.authority = token.authority; // Hasilnya ["user"]
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/login", // Jalur halaman login bawaan template lu
  },
  secret: "Melanolens-MuhammadRidha",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };