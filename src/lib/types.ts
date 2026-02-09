export type BookingInfo = {
  name: string;
  email: string;
  message?: string;
};

export type TimeSlot = {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  booked: boolean;
  bookedBy?: BookingInfo;
};

export type Schedule = {
  id: string;
  hostName: string;
  title: string;
  description: string;
  slotDurationMinutes: number;
  slots: TimeSlot[];
  createdAt: string;
};
