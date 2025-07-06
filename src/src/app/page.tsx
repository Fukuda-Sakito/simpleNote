// src/app/page.tsx

'use client';

import { useState } from 'react';
import { Folder, Pin, Plus, Palette } from 'lucide-react';
import { type Memo, type Genre, colorOptions } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import MemoCard from '@/components/MemoCard';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ダミーデータ（最終的にはAPIから取得します）
// 注意：これは仮のデータです。実際のuserIdなどは認証情報から取得します。
const dummyGenres: Genre[] = [
  { id: 'work', name: '仕事', color: 'bg-blue-100 text-blue-800', icon: '💼', userId: 'cl1', createdAt: new Date(), updatedAt: new Date() },
  { id: 'personal', name: '個人', color: 'bg-green-100 text-green-800', icon: '🏠', userId: 'cl1', createdAt: new Date(), updatedAt: new Date() },
  { id: 'shopping', name: '買い物', color: 'bg-yellow-100 text-yellow-800', icon: '🛒', userId: 'cl1', createdAt: new Date(), updatedAt: new Date() },
];

const dummyMemos: Memo[] = [
  { id: '1', title: '買い物リスト', content: '牛乳\nパン\n卵', color: 'bg-yellow-50', isPinned: true, createdAt: new Date('2024-01-15'), updatedAt: new Date(), genreId: 'shopping', userId: 'cl1' },
  { id: '2', title: '会議のメモ', content: 'プロジェクトの進捗について話し合い', color: 'bg-blue-50', isPinned: false, createdAt: new Date('2024-01-14'), updatedAt: new Date(), genreId: 'work', userId: 'cl1' },
  { id: '3', title: '読書リスト', content: '今月読みたい本\n1. デザインの教科書', color: 'bg-green-50', isPinned: true, createdAt: new Date('2024-01-13'), updatedAt: new Date(), genreId: 'personal', userId: 'cl1' },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  
  // 本来はAPIから取得するデータ
  const [memos, setMemos] = useState<Memo[]>(dummyMemos);
  const [genres, setGenres] = useState<Genre[]>(dummyGenres);

  // 新規メモ作成フォームの状態
  const [isCreating, setIsCreating] = useState(false);
  const [newMemo, setNewMemo] = useState({
    title: '',
    content: '',
    color: 'bg-white',
    genreId: '',
  });

  // TODO: これから実装するAPI連携のためのハンドラ関数
  const handleCreateMemo = () => {
    if (newMemo.title.trim() || newMemo.content.trim()) {
      console.log('Create memo:', newMemo);
      // ここでAPIを呼び出してメモを作成する処理を実装します
      // 成功したらフォームをリセット
      setNewMemo({ title: '', content: '', color: 'bg-white', genreId: '' });
      setIsCreating(false);
    }
  };

  const handleCreateGenre = (genreData: { name: string; color: string; icon: string }) => {
    console.log('Create genre:', genreData);
    // ここでAPIを呼び出してジャンルを作成する処理を実装します
  };

  const handleTogglePin = (id: string) => {
    console.log('Toggle pin:', id);
    // ここでAPIを呼び出してピンの状態を切り替える処理を実装します
  };

  const handleDeleteMemo = (id: string) => {
    console.log('Delete memo:', id);
    // ここでAPIを呼び出してメモを削除する処理を実装します
  };

  const handleArchiveMemo = (id: string) => {
    console.log('Archive memo:', id);
    // ここでAPIを呼び出してメモをアーカイブする処理を実装します
  };

  // 検索とジャンルによるメモのフィルタリング
  const filteredMemos = memos.filter((memo) => {
    const matchesSearch =
      memo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memo.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || memo.genreId === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  // メモをジャンルごとにグループ化
  const groupedMemos = genres.reduce(
    (acc, genre) => {
      const genreMemos = filteredMemos.filter((memo) => memo.genreId === genre.id);
      if (genreMemos.length > 0) {
        acc[genre.id] = {
          genre,
          pinned: genreMemos.filter((memo) => memo.isPinned),
          unpinned: genreMemos.filter((memo) => !memo.isPinned),
        };
      }
      return acc;
    },
    {} as Record<string, { genre: Genre; pinned: Memo[]; unpinned: Memo[] }>
  );

  const getColorClass = (colorValue: string) => {
    const colorOption = colorOptions.find((option) => option.value === colorValue);
    return colorOption
      ? `${colorOption.value} ${colorOption.border}`
      : 'bg-white border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        genres={genres}
        onCreateGenre={handleCreateGenre}
        onDeleteGenre={() => {}} // TODO
      />

      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedGenre === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedGenre('all')}
              className="whitespace-nowrap"
            >
              <Folder className="w-4 h-4 mr-2" />
              すべて
            </Button>
            {genres.map((genre) => (
              <Button
                key={genre.id}
                variant={selectedGenre === genre.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedGenre(genre.id)}
                className="whitespace-nowrap"
              >
                <span className="mr-2">{genre.icon}</span>
                {genre.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-8 max-w-2xl mx-auto">
          {!isCreating ? (
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setIsCreating(true)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 text-gray-500">
                  <Plus className="w-5 h-5" />
                  <span>メモを入力...</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className={`border-2 ${getColorClass(newMemo.color)}`}>
              <CardContent className="p-4 space-y-3">
                <Input
                  placeholder="タイトル"
                  value={newMemo.title}
                  onChange={(e) => setNewMemo({ ...newMemo, title: e.target.value })}
                  className="border-0 p-0 text-lg font-medium bg-transparent focus:ring-0"
                />
                <Textarea
                  placeholder="メモを入力..."
                  value={newMemo.content}
                  onChange={(e) =>
                    setNewMemo({ ...newMemo, content: e.target.value })
                  }
                  className="border-0 p-0 bg-transparent resize-none focus:ring-0 min-h-[100px]"
                  autoFocus
                />
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Select
                      value={newMemo.genreId}
                      onValueChange={(value) =>
                        setNewMemo({ ...newMemo, genreId: value })
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="ジャンル選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {genres.map((genre) => (
                          <SelectItem key={genre.id} value={genre.id}>
                            <div className="flex items-center gap-2">
                              <span>{genre.icon}</span>
                              <span>{genre.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                          <Palette className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <div className="grid grid-cols-4 gap-2 p-2">
                          {colorOptions.map((color) => (
                            <button
                              key={color.value}
                              className={`w-8 h-8 rounded-full border-2 ${
                                color.value
                              } ${
                                color.border
                              } hover:scale-110 transition-transform`}
                              onClick={() =>
                                setNewMemo({ ...newMemo, color: color.value })
                              }
                            />
                          ))}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsCreating(false)}
                    >
                      キャンセル
                    </Button>
                    <Button size="sm" onClick={handleCreateMemo}>
                      完了
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {Object.entries(groupedMemos).map(
          ([genreId, { genre, pinned, unpinned }]) => (
            <div key={genreId} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">{genre.icon}</span>
                <h2 className="text-lg font-semibold text-gray-800">
                  {genre.name}
                </h2>
                <Badge variant="secondary">
                  {pinned.length + unpinned.length}
                </Badge>
              </div>

              {pinned.length > 0 && (
                <div className="mb-6">
                  <h3 className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    <Pin className="w-3 h-3" />
                    <span>ピン留め済み</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {pinned.map((memo) => (
                      <MemoCard
                        key={memo.id}
                        memo={memo}
                        genre={genre}
                        onTogglePin={handleTogglePin}
                        onDelete={handleDeleteMemo}
                        onArchive={handleArchiveMemo}
                      />
                    ))}
                  </div>
                </div>
              )}

              {unpinned.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {unpinned.map((memo) => (
                    <MemoCard
                      key={memo.id}
                      memo={memo}
                      genre={genre}
                      onTogglePin={handleTogglePin}
                      onDelete={handleDeleteMemo}
                      onArchive={handleArchiveMemo}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        )}

        {filteredMemos.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Folder className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>
              {searchQuery
                ? `「${searchQuery}」に一致するメモはありません`
                : '表示するメモがありません'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}