export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface Block {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  name: string;
  blockId: string;
  blockName: string;
}

export interface DoctorSchedule {
  shiftId: string;
  shiftName: string;
  doctor: string;
}

export interface DaySchedule {
  day: string;
  date: string;
  roomData: Record<string, DoctorSchedule[]>;
}

export interface WeekSchedule {
  weekStart: string;
  weekEnd: string;
  data: DaySchedule[];
}