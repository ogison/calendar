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

import { bookSlot } from '@/lib/actions';
import { Schedule, TimeSlot } from '@/lib/types';
import { CalendarCheck, Clock, User } from 'lucide-react';

type Props = {
  schedule: Schedule;
};

export function BookingClient({ schedule }: Props) {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const availableSlots = schedule.slots.filter((s) => !s.booked);

  const groupedSlots = availableSlots.reduce(
    (acc, slot) => {
      if (!acc[slot.date]) acc[slot.date] = [];
      acc[slot.date].push(slot);
      return acc;
    },
    {} as Record<string, TimeSlot[]>
  );

  const sortedDates = Object.keys(groupedSlots).sort();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            {schedule.hostName}
          </div>
          <CardTitle className="text-2xl">{schedule.title}</CardTitle>
          {schedule.description && (
            <CardDescription>{schedule.description}</CardDescription>
          )}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {schedule.slotDurationMinutes}分
          </div>
        </CardHeader>
        <CardContent>
          {availableSlots.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <p className="text-lg font-medium">予約可能な枠がありません</p>
              <p className="text-sm">
                すべての枠が予約済みか、まだ枠が設定されていません。
              </p>
            </div>
          ) : selectedSlot ? (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm font-medium text-muted-foreground">
                  選択中の枠
                </p>
                <p className="text-lg font-semibold">
                  {formatDate(selectedSlot.date)} {selectedSlot.startTime} 〜{' '}
                  {selectedSlot.endTime}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1"
                  onClick={() => setSelectedSlot(null)}
                >
                  変更する
                </Button>
              </div>

              <form action={bookSlot} className="space-y-4">
                <input type="hidden" name="scheduleId" value={schedule.id} />
                <input type="hidden" name="slotId" value={selectedSlot.id} />

                <div className="space-y-2">
                  <Label htmlFor="name">お名前</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="田中花子"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="hanako@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">メッセージ（任意）</Label>
                  <Input
                    id="message"
                    name="message"
                    placeholder="よろしくお願いします"
                  />
                </div>

                <Button type="submit" className="w-full">
                  <CalendarCheck className="mr-2 h-4 w-4" />
                  この枠を予約する
                </Button>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                予約したい日時を選んでください
              </p>
              {sortedDates.map((date) => (
                <div key={date}>
                  <p className="mb-2 text-sm font-semibold">
                    {formatDate(date)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {groupedSlots[date]
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((slot) => (
                        <Button
                          key={slot.id}
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedSlot(slot)}
                        >
                          {slot.startTime} 〜 {slot.endTime}
                        </Button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
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
