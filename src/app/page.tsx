import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getAllSchedules } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { CalendarPlus, Calendar, Clock, User, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const schedules = getAllSchedules();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          <Calendar className="mr-2 inline-block h-8 w-8" />
          予定調整
        </h1>
        <p className="text-muted-foreground">
          空き枠を設定して、リンクを共有するだけで予定調整ができます
        </p>
      </div>

      <div className="mb-8 flex justify-center">
        <Button asChild size="lg">
          <Link href="/schedule/new">
            <CalendarPlus className="mr-2 h-5 w-5" />
            新しいスケジュールを作成
          </Link>
        </Button>
      </div>

      {schedules.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">作成済みスケジュール</h2>
          {schedules.map((schedule) => {
            const bookedCount = schedule.slots.filter((s) => s.booked).length;
            const totalCount = schedule.slots.length;

            return (
              <Card key={schedule.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {schedule.title}
                      </CardTitle>
                      {schedule.description && (
                        <CardDescription>
                          {schedule.description}
                        </CardDescription>
                      )}
                    </div>
                    <Badge variant={bookedCount > 0 ? 'default' : 'secondary'}>
                      {bookedCount}/{totalCount} 予約済
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        {schedule.hostName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {schedule.slotDurationMinutes}分
                      </span>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/schedule/${schedule.id}/bookings`}>
                        管理
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {schedules.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center text-muted-foreground">
            <Calendar className="mx-auto mb-3 h-12 w-12 opacity-50" />
            <p>まだスケジュールがありません</p>
            <p className="text-sm">
              上のボタンから新しいスケジュールを作成しましょう
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
