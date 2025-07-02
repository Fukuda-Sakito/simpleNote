// src/components/MemoCard.tsx

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { colorOptions, type Memo, type Genre } from '@/types';
import { Archive, MoreVertical, Pin, Trash2 } from 'lucide-react';

// MemoCardコンポーネントが受け取るプロパティの型定義
interface MemoCardProps {
  memo: Memo;
  genre: Genre;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
}

export default function MemoCard({
  memo,
  genre,
  onTogglePin,
  onDelete,
  onArchive,
}: MemoCardProps) {
  // メモの背景色とボーダー色を取得するヘルパー関数
  const getColorClass = (colorValue: string) => {
    const colorOption = colorOptions.find((option) => option.value === colorValue);
    return colorOption
      ? `${colorOption.value} ${colorOption.border}`
      : 'bg-white border-gray-200';
  };

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-200 cursor-pointer ${getColorClass(
        memo.color
      )}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={`${genre.color} text-xs`}>
                <span className="mr-1">{genre.icon}</span>
                {genre.name}
              </Badge>
            </div>
            <h3 className="font-medium text-gray-900 line-clamp-2">
              {memo.title}
            </h3>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(memo.id);
              }}
            >
              <Pin
                className={`w-3 h-3 ${
                  memo.isPinned ? 'fill-current text-gray-700' : 'text-gray-400'
                }`}
              />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onArchive(memo.id)}>
                  <Archive className="w-4 h-4 mr-2" />
                  アーカイブ
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={() => onDelete(memo.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  削除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-6">
          {memo.content}
        </p>
      </CardContent>
    </Card>
  );
}