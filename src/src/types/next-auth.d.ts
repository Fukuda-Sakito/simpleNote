// src/types/next-auth.d.ts

import 'next-auth/jwt';
import 'next-auth';

declare module 'next-auth/jwt' {
  /** JWTにIDプロパティを追加 */
  interface JWT {
    id?: string;
  }
}

declare module 'next-auth' {
  /** セッションオブジェクトにIDプロパティを追加 */
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}