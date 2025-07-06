// src/types/index.ts

// Prismaのモデルと一致させる
export interface Genre {
  id: string;
  name: string;
  color: string;
  icon: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Memo {
  id: string;
  title: string;
  content: string;
  color: string;
  isPinned: boolean;
  userId: string;
  genreId: string;
  createdAt: Date;
  updatedAt: Date;
}

// UI表示用の拡張型
export interface MemoWithGenre extends Memo {
  genre: Genre;
}

// 色の選択肢
export const colorOptions = [
  { name: 'デフォルト', value: 'bg-white', border: 'border-gray-200' },
  { name: '赤', value: 'bg-red-50', border: 'border-red-200' },
  { name: 'オレンジ', value: 'bg-orange-50', border: 'border-orange-200' },
  { name: '黄', value: 'bg-yellow-50', border: 'border-yellow-200' },
  { name: '緑', value: 'bg-green-50', border: 'border-green-200' },
  { name: '青', value: 'bg-blue-50', border: 'border-blue-200' },
  { name: '紫', value: 'bg-purple-50', border: 'border-purple-200' },
  { name: 'ピンク', value: 'bg-pink-50', border: 'border-pink-200' },
];