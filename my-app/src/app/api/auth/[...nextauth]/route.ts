// src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  // PrismaをNextAuthのアダプターとして使用する設定
  adapter: PrismaAdapter(prisma),
  // 認証プロバイダーの設定
  providers: [
    // メールアドレスとパスワードで認証するための設定
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      // 認証ロジック
      async authorize(credentials) {
        // credentialsがなければエラー
        if (!credentials?.email || !credentials?.password) {
          throw new Error('メールアドレスとパスワードが存在しません');
        }

        // 入力されたメールアドレスでユーザーを検索
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // ユーザーが存在しない場合
        if (!user || !user.password) {
          throw new Error('入力されたメールアドレスのユーザーは存在しません');
        }

        // 入力されたパスワードとDBのハッシュ化されたパスワードを比較
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        // パスワードが一致しない場合
        if (!isPasswordCorrect) {
          throw new Error('パスワードが間違っています');
        }

        // 認証成功。ユーザーオブジェクトを返す
        return user;
      },
    }),
  ],
  // セッション管理の方法を 'jwt' (JSON Web Token) に設定
  session: {
    strategy: 'jwt',
  },
  // セッションの有効期間 (30日)
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // ログインページのパス
  pages: {
    signIn: '/login',
  },
  // コールバック設定
  callbacks: {
    // JWTが作成・更新された時に呼ばれる
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // セッションがアクセスされた時に呼ばれる
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

// GETリクエストとPOSTリクエストを同じハンドラで処理
export { handler as GET, handler as POST };