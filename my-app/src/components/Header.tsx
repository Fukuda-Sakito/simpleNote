// src/components/Header.tsx

'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit3, Search, Settings } from 'lucide-react';
import { type Genre } from '@/types';
import { useState } from 'react';
import { Badge } from './ui/badge';

// ジャンル作成時の色の選択肢
const genreColorOptions = [
    { name: 'グレー', value: 'bg-gray-100 text-gray-800' },
    { name: '赤', value: 'bg-red-100 text-red-800' },
    { name: 'オレンジ', value: 'bg-orange-100 text-orange-800' },
    { name: '黄', value: 'bg-yellow-100 text-yellow-800' },
    { name: '緑', value: 'bg-green-100 text-green-800' },
    { name: '青', value: 'bg-blue-100 text-blue-800' },
    { name: '紫', value: 'bg-purple-100 text-purple-800' },
    { name: 'ピンク', value: 'bg-pink-100 text-pink-800' },
];

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  genres: Genre[];
  onCreateGenre: (newGenre: { name: string; color: string; icon: string }) => void;
  onDeleteGenre: (id: string) => void;
}

export default function Header({ 
    searchQuery, 
    onSearchChange, 
    genres, 
    onCreateGenre 
}: HeaderProps) {
  const [isGenreDialogOpen, setIsGenreDialogOpen] = useState(false);
  const [newGenre, setNewGenre] = useState({
    name: '',
    color: 'bg-gray-100 text-gray-800',
    icon: '📁',
  });

  const handleCreateGenre = () => {
    if (newGenre.name.trim()) {
      onCreateGenre(newGenre);
      setNewGenre({ name: '', color: 'bg-gray-100 text-gray-800', icon: '📁' });
      // ダイアログを閉じる処理は親コンポーネントの責務（ここではシンプルに閉じる）
      // setIsGenreDialogOpen(false); // 実際はAPI通信後に親からgenresが更新され再描画される
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Edit3 className="w-6 h-6 text-yellow-600" />
          <h1 className="text-xl font-semibold text-gray-900">MemoApp</h1>
        </div>

        <div className="flex-1 max-w-2xl relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="メモを検索"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-gray-100 border-0 focus:bg-white focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <Dialog open={isGenreDialogOpen} onOpenChange={setIsGenreDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              ジャンル管理
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ジャンル管理</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2 border-b pb-4">
                <Label>新しいジャンル</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="ジャンル名"
                    value={newGenre.name}
                    onChange={(e) =>
                      setNewGenre({ ...newGenre, name: e.target.value })
                    }
                  />
                  <Input
                    placeholder="絵文字"
                    value={newGenre.icon}
                    onChange={(e) =>
                      setNewGenre({ ...newGenre, icon: e.target.value })
                    }
                    className="w-20"
                  />
                </div>
                <Select
                  value={newGenre.color}
                  onValueChange={(value) =>
                    setNewGenre({ ...newGenre, color: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {genreColorOptions.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className={`px-2 py-1 rounded text-xs ${color.value}`}>
                          {color.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleCreateGenre} className="w-full">
                  ジャンルを追加
                </Button>
              </div>
              <div className="space-y-2">
                <Label>既存のジャンル</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {genres.map((genre) => (
                    <div
                      key={genre.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div className="flex items-center gap-2">
                        <span>{genre.icon}</span>
                        <span className="font-medium">{genre.name}</span>
                        <Badge className={genre.color}>{genre.name}</Badge>
                      </div>
                      {/*
                        // TODO: ジャンルの削除・編集機能はここに追加
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                      */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}