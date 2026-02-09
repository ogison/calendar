import { notFound } from 'next/navigation';
import { getSchedule } from '@/lib/store';
import { BookingClient } from './booking-client';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BookingPage({ params }: Props) {
  const { id } = await params;
  const schedule = getSchedule(id);

  if (!schedule) {
    notFound();
  }

  return <BookingClient schedule={schedule} />;
}
