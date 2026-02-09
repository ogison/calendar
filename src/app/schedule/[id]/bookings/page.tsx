import { notFound } from 'next/navigation';
import { getSchedule } from '@/lib/store';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CalendarCheck, Clock, User } from 'lucide-react';
import { CopyLinkButton } from './copy-link-button';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BookingsPage({ params }: Props) {
  const { id } = await params;
  const schedule = getSchedule(id);

  if (!schedule) {
    notFound();
  }

  const bookedSlots = schedule.slots.filter((s) => s.booked);
  const availableSlots = schedule.slots.filter((s) => !s.booked);

  const sortedSlots = [...schedule.slots].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });

  const groupedSlots = sortedSlots.reduce(
    (acc, slot) => {
      if (!acc[slot.date]) acc[slot.date] = [];
      acc[slot.date].push(slot);
      return acc;
    },
    {} as Record<string, typeof sortedSlots>
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

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{schedule.title}</CardTitle>
          {schedule.description && (
            <CardDescription>{schedule.description}</CardDescription>
          )}
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {schedule.hostName}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {schedule.slotDurationMinutes}分
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="mb-2 text-sm font-medium">予約リンク</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded bg-background px-3 py-2 text-sm">
                  /schedule/{schedule.id}
                </code>
                <CopyLinkButton scheduleId={schedule.id} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                このリンクを相手に共有してください
              </p>
            </div>

            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <CalendarCheck className="h-4 w-4 text-green-600" />
                予約済み: {bookedSlots.length}件
              </span>
              <span className="text-muted-foreground">
                空き: {availableSlots.length}件
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>予約状況</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedSlots).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              枠が設定されていません
            </p>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedSlots).map(([date, dateSlots]) => (
                <div key={date}>
                  <p className="mb-2 text-sm font-semibold">
                    {formatDate(date)}
                  </p>
                  <div className="space-y-1.5">
                    {dateSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                          slot.booked
                            ? 'border-green-200 bg-green-50'
                            : 'bg-background'
                        }`}
                      >
                        <span className="font-medium">
                          {slot.startTime} 〜 {slot.endTime}
                        </span>
                        {slot.booked && slot.bookedBy ? (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              {slot.bookedBy.name}（{slot.bookedBy.email}）
                            </span>
                            <Badge
                              variant="default"
                              className="bg-green-600 hover:bg-green-600"
                            >
                              予約済
                            </Badge>
                          </div>
                        ) : (
                          <Badge variant="secondary">空き</Badge>
                        )}
                      </div>
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
