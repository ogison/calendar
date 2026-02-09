import { notFound } from 'next/navigation';
import { getSchedule } from '@/lib/store';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarCheck, Clock, User } from 'lucide-react';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ slot?: string }>;
};

export default async function ConfirmedPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { slot: slotId } = await searchParams;
  const schedule = getSchedule(id);

  if (!schedule) {
    notFound();
  }

  const slot = slotId ? schedule.slots.find((s) => s.id === slotId) : undefined;

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CalendarCheck className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">予約が完了しました</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-4 text-left">
            <p className="text-lg font-semibold">{schedule.title}</p>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {schedule.hostName}
              </p>
              {slot && (
                <>
                  <p className="flex items-center gap-1">
                    <CalendarCheck className="h-4 w-4" />
                    {formatDate(slot.date)}
                  </p>
                  <p className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {slot.startTime} 〜 {slot.endTime}（
                    {schedule.slotDurationMinutes}分）
                  </p>
                </>
              )}
              {slot?.bookedBy && (
                <p className="mt-2 text-foreground">
                  予約者: {slot.bookedBy.name}（{slot.bookedBy.email}）
                </p>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            予約情報が相手に送信されました。
          </p>

          <Button asChild variant="outline">
            <Link href="/">トップに戻る</Link>
          </Button>
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
