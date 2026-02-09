'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { createSchedule } from '@/lib/actions';
import { CalendarPlus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type PendingSlot = {
  id: string;
  date: string;
  startTime: string;
};

export default function NewSchedulePage() {
  const [slots, setSlots] = useState<PendingSlot[]>([]);
  const [slotDate, setSlotDate] = useState('');
  const [slotTime, setSlotTime] = useState('');
  const [duration, setDuration] = useState('30');

  function addSlot() {
    if (!slotDate || !slotTime) return;
    setSlots((prev) => [
      ...prev,
      { id: crypto.randomUUID(), date: slotDate, startTime: slotTime },
    ]);
    setSlotTime('');
  }

  function removeSlot(id: string) {
    setSlots((prev) => prev.filter((s) => s.id !== id));
  }

  function addBulkSlots() {
    if (!slotDate) return;
    const dur = parseInt(duration, 10);
    const newSlots: PendingSlot[] = [];
    for (let h = 9; h < 18; h++) {
      for (let m = 0; m < 60; m += dur) {
        if (h * 60 + m + dur > 18 * 60) break;
        newSlots.push({
          id: crypto.randomUUID(),
          date: slotDate,
          startTime: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
        });
      }
    }
    setSlots((prev) => [...prev, ...newSlots]);
  }

  const sortedSlots = [...slots].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });

  const groupedSlots = sortedSlots.reduce(
    (acc, slot) => {
      if (!acc[slot.date]) acc[slot.date] = [];
      acc[slot.date].push(slot);
      return acc;
    },
    {} as Record<string, PendingSlot[]>
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        トップに戻る
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">新しいスケジュールを作成</CardTitle>
          <CardDescription>
            空き枠を設定して、予約リンクを相手に共有しましょう
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={(formData) => {
              formData.append(
                'slots',
                JSON.stringify(
                  slots.map((s) => ({
                    date: s.date,
                    startTime: s.startTime,
                  }))
                )
              );
              createSchedule(formData);
            }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hostName">あなたの名前</Label>
                <Input
                  id="hostName"
                  name="hostName"
                  required
                  placeholder="山田太郎"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">予定のタイトル</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  placeholder="打ち合わせ、面談 など"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">説明（任意）</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="ミーティングの詳細など"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slotDurationMinutes">1枠の時間（分）</Label>
                <select
                  id="slotDurationMinutes"
                  name="slotDurationMinutes"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                >
                  <option value="15">15分</option>
                  <option value="30">30分</option>
                  <option value="45">45分</option>
                  <option value="60">60分</option>
                  <option value="90">90分</option>
                  <option value="120">120分</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="font-semibold">空き枠を追加</h3>

              <div className="flex flex-wrap items-end gap-2">
                <div className="space-y-1">
                  <Label htmlFor="slotDate">日付</Label>
                  <Input
                    id="slotDate"
                    type="date"
                    value={slotDate}
                    onChange={(e) => setSlotDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="slotTime">開始時間</Label>
                  <Input
                    id="slotTime"
                    type="time"
                    value={slotTime}
                    onChange={(e) => setSlotTime(e.target.value)}
                  />
                </div>
                <Button type="button" variant="outline" onClick={addSlot}>
                  追加
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addBulkSlots}
                >
                  9:00〜18:00 一括追加
                </Button>
              </div>

              {Object.keys(groupedSlots).length > 0 && (
                <div className="space-y-3 pt-2">
                  {Object.entries(groupedSlots).map(([date, dateSlots]) => (
                    <div key={date}>
                      <p className="mb-1 text-sm font-medium text-muted-foreground">
                        {formatDate(date)}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {dateSlots.map((slot) => (
                          <Badge
                            key={slot.id}
                            variant="secondary"
                            className="cursor-pointer gap-1 pr-1 hover:bg-destructive/10"
                            onClick={() => removeSlot(slot.id)}
                          >
                            {slot.startTime}
                            <Trash2 className="h-3 w-3 text-muted-foreground" />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground">
                    合計 {slots.length} 枠 / クリックで削除
                  </p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={slots.length === 0}
            >
              <CalendarPlus className="mr-2 h-4 w-4" />
              スケジュールを作成
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}（${days[d.getDay()]}）`;
}
