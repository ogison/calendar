import { Schedule } from './types';

// Simple in-memory store for demo purposes.
// Data persists as long as the server process is running.
const schedules = new Map<string, Schedule>();

export function getSchedule(id: string): Schedule | undefined {
  return schedules.get(id);
}

export function getAllSchedules(): Schedule[] {
  return Array.from(schedules.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function saveSchedule(schedule: Schedule): void {
  schedules.set(schedule.id, schedule);
}

export function deleteSchedule(id: string): boolean {
  return schedules.delete(id);
}
