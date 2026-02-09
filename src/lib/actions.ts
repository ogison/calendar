'use server';

import { redirect } from 'next/navigation';
import { Schedule, TimeSlot } from './types';
import { getSchedule, saveSchedule } from './store';

export async function createSchedule(formData: FormData) {
  const hostName = formData.get('hostName') as string;
  const title = formData.get('title') as string;
  const description = (formData.get('description') as string) || '';
  const slotDurationMinutes = parseInt(
    formData.get('slotDurationMinutes') as string,
    10
  );
  const slotsJson = formData.get('slots') as string;

  if (!hostName || !title || !slotDurationMinutes || !slotsJson) {
    throw new Error('必須項目が入力されていません');
  }

  const rawSlots: { date: string; startTime: string }[] = JSON.parse(slotsJson);

  const id = generateId();
  const slots: TimeSlot[] = rawSlots.map((s) => ({
    id: generateId(),
    date: s.date,
    startTime: s.startTime,
    endTime: addMinutes(s.startTime, slotDurationMinutes),
    booked: false,
  }));

  const schedule: Schedule = {
    id,
    hostName,
    title,
    description,
    slotDurationMinutes,
    slots,
    createdAt: new Date().toISOString(),
  };

  saveSchedule(schedule);
  redirect(`/schedule/${id}/bookings`);
}

export async function bookSlot(formData: FormData) {
  const scheduleId = formData.get('scheduleId') as string;
  const slotId = formData.get('slotId') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = (formData.get('message') as string) || undefined;

  if (!scheduleId || !slotId || !name || !email) {
    throw new Error('必須項目が入力されていません');
  }

  const schedule = getSchedule(scheduleId);
  if (!schedule) {
    throw new Error('スケジュールが見つかりません');
  }

  const slot = schedule.slots.find((s) => s.id === slotId);
  if (!slot) {
    throw new Error('スロットが見つかりません');
  }
  if (slot.booked) {
    throw new Error('この枠はすでに予約されています');
  }

  slot.booked = true;
  slot.bookedBy = { name, email, message };
  saveSchedule(schedule);

  redirect(`/schedule/${scheduleId}/confirmed?slot=${slotId}`);
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const totalMinutes = h * 60 + m + minutes;
  const newH = Math.floor(totalMinutes / 60) % 24;
  const newM = totalMinutes % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}
